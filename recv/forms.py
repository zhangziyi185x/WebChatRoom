"""
暂时 没有用到
"""

from wtforms import Form, validators, widgets

from wtforms.fields import simple, core


class RegForm(Form):
    username = simple.StringField(
        label="用户名",
        validators=[
            validators.DataRequired(message="用户名不能为空"),
            validators.Length(min=6, max=16, message="用户名必须大于等于6，小于等于16")
        ],
        render_kw={"class": "my_class"}
    )

    password = simple.PasswordField(
        label="密码",
        validators=[
            validators.DataRequired(message="密码不能为空"),
            validators.Length(min=6, max=16, message="密码必须大于等于6，小于等于16")
        ]
    )

    repassword = simple.PasswordField(
        label="确认密码",
        validators=[
            validators.DataRequired(message="确认密码不能为空"),
            validators.EqualTo("password", message="两次密码不一致")
        ]
    )
    # widget=widgets.RadioInput(),
    gender = core.RadioField(
        label="性别",
        choices=(
            (0, "女"),
            (1, "男")
        ),
        default=1,
        render_kw={"class": "my_class"},
        coerce=int
    )

    email = simple.StringField(
        label="邮箱",
        validators=[
            validators.DataRequired(message="邮箱不能为空"),
            validators.Email(message="不符合规定")
        ]
    )


class LoginForm(Form):
    username = simple.StringField(
        label="用户名",
        validators=[
            validators.DataRequired(message="用户名不能为空"),
            validators.Length(min=6, max=16, message="用户名必须大于等于6，小于等于16")
        ]
    )

    password = simple.PasswordField(
        label="密码",
        validators=[
            validators.DataRequired(message="密码不能为空"),
            validators.Length(min=6, max=16, message="密码必须大于等于6，小于等于16")
        ]
    )
