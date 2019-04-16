from flask import Blueprint, request, render_template, redirect, session
from recv.forms import RegForm, LoginForm
from settings import DB

index = Blueprint('index', __name__)


@index.route('/zf_index')
def zf_index():
    return render_template("web_client.html")
