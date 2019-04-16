from geventwebsocket.websocket import WebSocket
from geventwebsocket.server import WSGIServer
from geventwebsocket.handler import WebSocketHandler
from flask import Flask, request
import json
from settings import SOC_RES, DB
from bson import ObjectId

app01 = Flask(__name__)

socket_dict = {}


def chage_friend_list(id_list):
    """
    获取 携带 用户 头像 昵称 的 列表
    :param id_list:
    :return:
    """
    user_list = DB.user_info.find({"_id": {'$in': [ObjectId(i) for i in id_list]}}, {'username': 0, 'password': 0})
    user_list = list(user_list)
    for i in user_list:
        i["_id"] = str(i.get("_id"))

    return user_list


@app01.route('/ws/<user_id>')
def web(user_id):
    try:
        user_conn = request.environ.get('wsgi.websocket')  # type: WebSocket
        socket_dict[user_id] = user_conn

        user_list = list(socket_dict.keys())


        # 发送聊天室信息
        socket_info_dict = {
            'count': len(socket_dict),
            'user_list': chage_friend_list(user_list)
        }
        SOC_RES['code'] = 1
        SOC_RES['data'] = socket_info_dict
        print(socket_info_dict)
        for name, conn in socket_dict.items():
            conn.send(json.dumps(SOC_RES, ensure_ascii=False))

        while 1:
            try:
                message = user_conn.receive()
                print("user_>>> ", message)
                if not message:
                    socket_dict.pop(user_id)
                    print(socket_dict)
                    # 发送用户 退出的 消息
                    for conn in socket_dict.values():
                        SOC_RES['code'] = 2
                        SOC_RES['data'] = user_id
                        conn.send(json.dumps(SOC_RES, ensure_ascii=False))
                    return ''
            except:
                return ''
            data = json.loads(message)
            # print(data)
            SOC_RES['code'] = 0
            SOC_RES['data'] = data
            to_user = data.get('to_user')
            if not to_user:
                for name, item in socket_dict.items():
                    if item == user_conn:
                        continue
                    item.send(json.dumps(SOC_RES, ensure_ascii=False))

            else:
                app_conn = socket_dict.get(to_user)
                # print(app_conn)
                try:
                    app_conn.send(json.dumps(SOC_RES, ensure_ascii=False))
                except:
                    continue

    except Exception as r:
        print(r)


if __name__ == '__main__':
    try:
        server = WSGIServer(("0.0.0.0", 8090), application=app01, handler_class=WebSocketHandler)
        server.serve_forever()
    except Exception as e:
        print(e)
