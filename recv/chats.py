from flask import Blueprint, send_file, request, jsonify

from settings import RECORD_PATH, RES, DB
import os, time
from bson import ObjectId
from uuid import uuid4
from flask_cors import *

chats = Blueprint("chats", __name__)
CORS(chats, supports_credentials=True)


def alter_chat_list(chat_list):
    # print(chat_list, 'lissssssssssssss')
    id_list = []
    for item in chat_list:
        id_list.append(ObjectId(item.get('from_user')))
    # 去重
    id_list = list(set(id_list))
    # print(id_list)
    user_list = DB.user_info.find({"_id": {'$in': id_list}})
    # print(list(user_list),2222222)
    user_dict = {}
    # 转换结构
    for user in user_list:
        id = str(user.pop("_id"))
        user_dict[id] = user

    for item in chat_list:
        item['nick'] = user_dict[item.get("from_user")].get("nick")
        item['avatar'] = user_dict[item.get("from_user")].get("avatar")

    return chat_list


@chats.route('/chat_list', methods=['POST'])
def chat_list():
    # print(request.form.to_dict(), 'cha1111111111')

    to_user = request.form.get("to_user")
    from_user = request.form.get("from_user")
    if to_user:
        """
        {
        "user_list": ["user_1", "user_2"],
        "chat_list": [
            {
                "from_user": "123",
                "type": "img" or "audio" or "text",
                "msg": "123.jpg" or "123.mp3" or "你好啊"
            }
            ....
            ]
        }
        """

        chat_obj = DB.single_chats.find_one({"user_list": {"$all": [to_user, from_user]}})
        print(chat_obj)
        if chat_obj:
            chat_list = chat_obj.get("chat_list", [])
        else:
            chat_list = []

    else:
        """
          {
          "from_user":"123",
          "type": "img" or "audio" or "text",
          "msg": "123.jpg" or "123.mp3" or "你好啊"
          }
          """
        chat_obj = DB.multi_chats.find({}, {"_id": 0})

        chat_list = list(chat_obj)

    # 处理消息  列表
    new_chat_list = alter_chat_list(chat_list)
    # print(new_chat_list)
    RES['code'] = 0
    RES['msg'] = '成功!'
    RES['data'] = new_chat_list
    return jsonify(RES)


def set_chats(chat_info):
    """
    設置聊天记录
    :param chat_info:
    :return:
    """
    # 要求数据 结构
    # {'to_user': '5c93866bb325731934f9e209', 'from_user': '5c9384c7b32573416800f1aa', 'msg': '121231', 'type': 'text'}

    """
    insert_one({"user_list":[user1,user2],"chat_list":[{
                "from_id":"123",
                "type":"image" / "audio"
                "msg":"123.jpg" / "123.mp3"/ '你好啊'
                ]})

    insert_one({
              "from_id":"123",
              "type":"image" / "audio"
              "msg":"123.jpg" / "123.mp3"/ '你好啊'
              })
    """

    to_user = chat_info.pop("to_user")
    from_user = chat_info.get("from_user")
    chat_info['time'] = time.time()

    if to_user:
        chat_obj = DB.single_chats.find_one({"user_list": {"$all": [to_user, from_user]}})
        # 插入单聊消息 判断消息 聊天记录 是否存在
        # print(chat_obj, 22222)
        if chat_obj:
            # print(333333)
            DB.single_chats.update_one(
                {"_id": chat_obj.get('_id')}, {'$push': {"chat_list": chat_info}})
        else:
            DB.single_chats.insert_one({"user_list": [to_user, from_user], "chat_list": [chat_info]})
    else:
        # 插入群聊消息
        # print(1111)
        DB.multi_chats.insert_one(chat_info)
