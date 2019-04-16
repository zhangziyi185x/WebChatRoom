from flask import Flask
from settings import SECRET_KEY
from recv.user import user
from recv.index import index
from recv.get_set_123 import get_set
from recv.chats import chats
from flask_cors import *

app = Flask(__name__)
CORS(app, supports_credentials=True)

app.secret_key = SECRET_KEY

app.register_blueprint(user)
app.register_blueprint(index)
app.register_blueprint(get_set)
app.register_blueprint(chats)

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=9090, debug=True)


