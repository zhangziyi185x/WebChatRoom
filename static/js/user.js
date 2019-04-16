var user_info = null;
var ws = null;
$(function () {
    // 注册控制   /////////////////////////////////////////////////////////////

    $('#reg').click(function () {
        // console.log('reg___reg');
        // console.log($('#reg_avatar')[0].files[0]);
        var form_data = new FormData();


        // // 隐藏 登录框
        // $('#myModal').modal('hide');
        var reg_username = $('#reg_username').val();
        var reg_password = $('#reg_password').val();
        var reg_nick = $('#reg_nick').val();


        var form_obj = new FormData();
        form_obj.append('avatar', $('#reg_avatar')[0].files[0]);
        form_obj.append('username', reg_username);
        form_obj.append('password', reg_password);
        form_obj.append('nick', reg_nick);

        $.ajax({
            url: http_url + '/zf_reg',
            type: 'post',
            processData: false, //  #  不需要处理数据编码格式
            contentType: false,//	 #  不需要处理请求头
            data: form_obj,
            success: function (res) {
                alert(res.msg);
                // console.log(res);
                if (res.code === 0) {
                    $('#RegModal').modal('hide');
                    $('#myModal').modal('show');
                } else {
                }
            }
        });
    });

    //登录控制  /////////////////////////////////////////////////////////////////////

    $('#login').click(function () {
        // 隐藏 登录框
        var username = $('#username').val();
        var password = $('#password').val();
        // console.log(username)
        // 失败提示

        $.post(http_url + '/zf_login', {username, password}, function (res) {
            // console.log(res);
            if (res.code === 0) {
                user_info = res.data;

                $('#login_li').css('display', 'none');
                // 登录显示 个人用户信息

                $('#from_id').text(res.data._id);
                $('#user_info').removeClass();
                $('#user_info a span').text(res.data.nick);
                $('#user_info a img').attr('src', http_url + "/get_avatar/" + res.data.avatar);
                $('#myModal').modal('hide');

                // 登录 ws webSocket
                create_ws(res.data._id);
            } else {
                alert(res.msg);
            }
        }, 'json');
    });

    //  websocket  /////////////////////////////////////////////////////////////////


    function create_ws(user_id) {
        ws = new WebSocket(ws_url + user_id);
        ws.onmessage = function (event) {
            data_obj = JSON.parse(event.data);

            console.log(data_obj);

            if (data_obj.code === 1) {
                document.getElementById('count').innerText = data_obj.data.count;
                document.getElementById('friend_list').innerHTML = '';
                for (var i = 0; i < data_obj.data.user_list.length; i++) {
                    create_friend(data_obj.data.user_list[i])
                }
            } else if (data_obj.code === 2) {
                var err_id = data_obj.data;
                console.log(err_id)
                $("#" + err_id).remove()

            } else {
                // 添加到 消息列表
                create_chat(data_obj.data);
            }
        };
        ws.onclose = function () {
            create_ws(user_id)
        }
    }

    // 发送文字消息 ////////////////////
    $('#send_msg').click(function () {

        var from_id = document.getElementById("from_id").innerText;
        if (from_id) {
            var msg = document.getElementById("message").value;
            if (msg) {
                document.getElementById("message").value = '';
                var to_user = document.getElementById("to_user").innerText;
                var msg_obj = {
                    to_user: to_user,
                    from_user: from_id,
                    msg: msg,
                    type: 'text',
                    nick: user_info.nick,
                    avatar: user_info.avatar,
                };
                var msg_json = JSON.stringify(msg_obj);
                ws.send(msg_json);

                // 发送请求保存 文字 聊天记录
                $.post(http_url + '/upload_text', msg_obj, function (res) {
                    console.log(res.data);
                }, 'json');
                console.log(user_info, 111)

                // 添加到聊天 窗口中
                create_chat({
                    type: 'text',
                    msg: msg,
                    from_user: user_info._id,
                    avatar: user_info.avatar,
                    nick: user_info.nick
                });


            } else {
                alert('不能发送空消息!!')
            }
        } else {
            alert('请登录!!')
        }
    });
    // 发送图片消息
    $("#send_img").click(function () {

        var from_id = document.getElementById("from_id").innerText;
        if (from_id) {
            var img_obj = $('#chat_img')[0].files[0];
            if (img_obj) {
                var form_obj = new FormData();
                var to_user = document.getElementById("to_user").innerText;
                form_obj.append('img', img_obj);
                form_obj.append('to_user', to_user);
                form_obj.append('from_user', from_id);
                form_obj.append('type', 'img');
                form_obj.append('nick', user_info.nick);
                form_obj.append('avatar', user_info.avatar);

                $.ajax({
                    url: http_url + '/upload_img',
                    type: 'post',
                    processData: false, //  #  不需要处理数据编码格式
                    contentType: false,//	 #  不需要处理请求头
                    data: form_obj,
                    success: function (res) {
                        // alert(res.msg);
                        console.log(res);
                        if (res.code === 0) {
                            ws.send(JSON.stringify(res.data));

                            // 添加到聊天 窗口中
                            create_chat({
                                type: "img",
                                img_name: res.data.img_name,
                                from_user: user_info._id,
                                avatar: user_info.avatar,
                                nick: user_info.nick
                            });


                        }
                    }
                });
            } else {
                alert('不能发送空的图片!!')
            }
        } else {
            alert('请登录!!')
        }
    })
    // 传唤聊天对象


});
