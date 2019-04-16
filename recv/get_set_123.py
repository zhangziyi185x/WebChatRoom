from flask import Blueprint, request, render_template, redirect, jsonify, send_file
import os, time, uuid

from recv.chats import set_chats
from recv.forms import RegForm, LoginForm
from settings import DB, RECORD_PATH, RES, AVATAR, IMAGES
from bson import ObjectId
from copy import deepcopy

get_set = Blueprint('get_set', __name__)





@get_set.route("/get_avatar/<avatar_name>")
def get_avatar(avatar_name):
    """
    获取 用户的头像
    :param avatar_name:
    :return:
    """
    cover_path = os.path.join(AVATAR, avatar_name)
    return send_file(cover_path)


@get_set.route("/get_record/<record_name>")
def get_record(record_name):
    """
    获取 录音文件
    :param zhangfei record_name:
    :return:
    """
    cover_path = os.path.join(RECORD_PATH, record_name)
    return send_file(cover_path)


@get_set.route("/get_img/<img_name>")
def get_img(img_name):
    """
    获取 图片文件
    :param zhangfei img_name:
    :return:
    """
    cover_path = os.path.join(IMAGES, img_name)
    return send_file(cover_path)


@get_set.route("/upload_record", methods=["POST"])
def upload_record():
    """
    用户 上传 录音文件  保存
    保存聊天记录
    :return: 录音文件名 以及其他的 聊天信息
    """
    chat_info = request.form.to_dict()
    # {'from_id': '5c83606db3257336fc8a811a',
    # 'to_id': '5c83f1cdb3257339743c2cac',
    # 'type': 'record'
    # }

    record_name = f"{uuid.uuid4()}.mp3"

    # ab2d0db7d43a47e6bbc90fe96d6a
    record = request.files.get('audio')

    record.save(record.filename)
    # 录音文件 名字
    print(record.filename, 111111111111111111111)

    record_path = os.path.join(RECORD_PATH, record_name)

    os.system(f"ffmpeg -i  {record.filename} {record_path} -y")
    os.remove(record.filename)

    """ 聊天记录 """
    chat_info['record_name'] = record_name
    # print(chat_info, 'MP3')
    # mongodb  会修改 提交保存的 信息
    set_chats(deepcopy(chat_info))

    # print(chat_info, 'get_set')
    RES['code'] = 0
    RES['msg'] = '上传成功'
    RES['data'] = chat_info

    return jsonify(RES)


@get_set.route("/upload_img", methods=["POST"])
def upload_img():
    """
    用户上传 录音文件 并 保存
    保存 聊天 记录
    :return: 保存的文件名
    """
    chat_info = request.form.to_dict()
    # {'from_id': '5c83606db3257336fc8a811a',
    # 'to_id': '5c83f1cdb3257339743c2cac',
    # 'type': 'img'
    # }

    img_name = f"{uuid.uuid4()}.jpg"
    record_path = os.path.join(IMAGES, img_name)

    # 获取上传的 图片并保存
    img = request.files.get('img')
    img.save(record_path)
    # 录音文件 名字
    chat_info['img_name'] = img_name

    # print(chat_info, 1111111111)
    """ 设置聊天记录 """

    set_chats(deepcopy(chat_info))

    # print(chat_info, 'img22222222222')
    RES['code'] = 0
    RES['msg'] = '上传成功'
    RES['data'] = chat_info

    return jsonify(RES)


@get_set.route("/upload_text", methods=["POST"])
def upload_text():
    """
    上传 APP 用户的 文字消息  保存聊天记录
    :return:
    """
    chat_info = request.form.to_dict()

    # 设置聊天记录
    set_chats(deepcopy(chat_info))
    # set_chats(chat_info)

    # print(chat_info, 'text')
    RES['code'] = 0
    RES['msg'] = '上传成功'
    RES['data'] = {}
    return jsonify(RES)
