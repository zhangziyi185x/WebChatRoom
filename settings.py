""" 数据库配置 """
from pymongo import MongoClient
import os

db_client = MongoClient(host='127.0.0.1', port=27017)
DB = db_client['WebQQ']

# DB.aa.insert_one({'aaa': 1})
""" session key """
SECRET_KEY = "!Df@#$F%^2ASS45sdfSDF@SDF#$%^dgsdfasf&*("

""" Avatar 头像存储位置 """
AVATAR = os.path.join('static', 'Avatar')

""" SOCKET 协议 """

SOC_RES = {
    'code': 1,
    "data": '',
}
""" SERVER 协议 """
RES = {
    'code': 1,
    "data": {},
    'msg': ''
}



""" 语音存放目录 """

RECORD_PATH = 'Record'
IMAGES = 'Images'
