import os

from flask import Blueprint, request, render_template, redirect, session, jsonify
from recv.forms import RegForm, LoginForm
from settings import DB, RES, AVATAR
from bson import ObjectId

user = Blueprint('user', __name__)


@user.route('/zf_reg', methods=['POST'])
def zf_reg():
    user_info = request.form.to_dict()

    # 判断用户是否存在
    username = user_info.get('username')
    user = DB.user_info.find_one({'username': username})
    if user:
        RES['code'] = 1
        RES['msg'] = "用户已经存在"
        RES['data'] = {}

        return jsonify(RES)
    print(user_info)
    # 定义 头像名称
    avatar_name = username + '.jpg'
    # 获取头像文件
    avatar = request.files.get('avatar')
    # 拼接存放位置
    avatar_path = os.path.join(AVATAR, avatar_name)
    # 保存头像
    avatar.save(avatar_path)
    # 添加头像信息
    user_info['avatar'] = avatar_name
    # 保存到数据库
    DB.user_info.insert_one(user_info)

    RES['code'] = 0
    RES['msg'] = "注册成功"
    RES['data'] = {}

    return jsonify(RES)


@user.route('/zf_login', methods=['POST'])
def zf_login():
    user_info = DB.user_info.find_one(request.form.to_dict(), {'password': 0})
    print(user_info)
    if not user_info:
        RES['code'] = 1
        RES['msg'] = "用户名或密码 错误!"
        RES['data'] = {}
        return jsonify(RES)

    user_info['_id'] = str(user_info.get("_id"))
    RES['code'] = 0
    RES['msg'] = "登陆成功!"
    RES['data'] = user_info
    return jsonify(RES)


@user.route('/auto_login', methods=['POST'])
def auto_login():
    user_id = session.get('user_id')
    print(user_id, 111111111111)
    user_info = DB.user_info.find_one({"_id": ObjectId(user_id)}, {'password': 0})
    # print(user_info)
    # chat_all_dict = get_chat_all(user_id)

    if not user_info:
        return jsonify({"code": 1, 'msg': '账号或密码错误', "data": {}})

    # user_info['chat_all_dict'] = chat_all_dict
    user_info['_id'] = str(user_info.get("_id"))
    RES['code'] = 0
    RES['msg'] = '登录成功!'
    RES['data'] = user_info

    return jsonify(RES)
