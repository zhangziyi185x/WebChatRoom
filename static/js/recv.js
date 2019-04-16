// 创建好友列表 ///////////////////////////////////////

function create_friend(friend_obj) {
    var ul_tag = document.getElementById('friend_list');
    var li_tag = document.createElement('li');
    li_tag.className = 'list-group-item';
    li_tag.id = friend_obj._id;
    // 创建点击事件
    li_tag.onclick = function () {
        // 更改 聊天对象的 值
        if (user_info._id === friend_obj._id) {
            alert('不能跟自己聊天!')
        } else {
            document.getElementById('to_user').innerText = friend_obj._id;
            document.getElementById('to_nick').innerText = friend_obj.nick;
            // 获取聊天记录
            get_chat_list(friend_obj)
        }
    };

    //<img src= alt="" className=>
    //    <strong className="form_user">章子怡</strong>
    var avatar_tag = document.createElement('img');
    avatar_tag.className = "img-circle";
    avatar_tag.src = "/static/Avatar/" + friend_obj.avatar;
    var nick_tag = document.createElement('strong');
    nick_tag.className = "form_user";
    nick_tag.innerText = friend_obj.nick;

    li_tag.appendChild(avatar_tag);
    li_tag.appendChild(nick_tag);
    ul_tag.appendChild(li_tag)
}

function get_chat_list(friend) {
    console.log(friend, 1111111111111111111);
    var data = {
        from_user: document.getElementById("from_id").innerText,
        to_user: friend._id
    };

    $.post(http_url + '/chat_list', data, function (res) {
        console.log(res);
        if (res.code === 0) {
            document.getElementById('message_list').innerHTML = '';

            for (var i = 0; i < res.data.length; i++) {
                create_chat(res.data[i])
                // if (res.data[i].from_user === user_info._id) {
                //     create_my_chat(res.data[i])
                // } else {
                //     create_from_chat(res.data[i])
                // }
            }
        } else {
            alert(res.msg);
        }
    }, 'json');
}

// 获取 群聊的 聊天记录
$(function () {

    $("#btn_multi_chat").click(function () {

        var from_user = document.getElementById("from_id").innerText;
        if (from_user) {
            console.log(11111111);
            $("#to_user").text('');
            $("#to_nick").text('');

            var data = {
                from_user: from_user,
                to_user: ''
            };
            // 获取群聊中所有的 聊天记录
            $.post(http_url + '/chat_list', data, function (res) {
                // console.log(res);
                if (res.code === 0) {

                    // console.log(res.data[0].from_user);
                    // console.log(user_info);

                    document.getElementById('message_list').innerHTML = '';
                    for (var i = 0; i < res.data.length; i++) {
                        create_chat(res.data[i])
                        // if (res.data[i].from_user === user_info._id) {
                        //     create_my_chat(res.data[i])
                        // } else {
                        //     create_from_chat(res.data[i])
                        // }
                    }

                } else {
                    alert(res.msg);
                }
            }, 'json');

        } else {
            alert('请登录!')
        }
    })
});

function create_chat(chat_info) {
    //  三种类型  record  img  text

    var ul_tag = document.getElementById("message_list");
    var li_tag = document.createElement("li");

    li_tag.className = 'list-group-item';
    if (chat_info.from_user === user_info._id) {
        li_tag.style.textAlign = 'right';
    }

    var span_tag = document.createElement('span');
    span_tag.className = 'msg';


    if (chat_info.type === 'record') {
        // 类型为  录音
        var btn_tag = document.createElement('button');
        btn_tag.className = 'btn btn-success';
        btn_tag.onclick = function () {
            document.getElementById('player').src = http_url + '/get_record/' + chat_info.record_name;
        };
        var record_tag = document.createElement('span');
        record_tag.className = "glyphicon glyphicon-volume-up";
        record_tag.innerText = '...';
        btn_tag.appendChild(record_tag);
        span_tag.appendChild(btn_tag);

    } else if (chat_info.type === 'img') {
        // 类型为  图片
        var img_tag = document.createElement('img');
        img_tag.style.width = '150px';
        img_tag.src = http_url + '/get_img/' + chat_info.img_name;
        span_tag.appendChild(img_tag);

    } else {
        // 类型为  文字
        span_tag.innerText = chat_info.msg;
    }


    var strong_tag = document.createElement('strong');
    strong_tag.className = 'form_user';
    strong_tag.innerText = " : " + chat_info.nick;
    var avatar_tag = document.createElement('img');
    avatar_tag.src = http_url + '/get_avatar/' + chat_info.avatar;
    avatar_tag.className = 'img-circle';

    if (chat_info.from_user === user_info._id) {
        // 消息时本人 发送 时
        li_tag.appendChild(span_tag);
        li_tag.appendChild(strong_tag);
        li_tag.appendChild(avatar_tag);
    } else {

        li_tag.appendChild(avatar_tag);
        li_tag.appendChild(strong_tag);
        li_tag.appendChild(span_tag);
    }
    ul_tag.appendChild(li_tag);
}

// function create_from_chat(chat_info) {
//     //  三种类型  record  img  text
//
//     var ul_tag = document.getElementById("message_list");
//     var li_tag = document.createElement("li");
//     li_tag.className = 'list-group-item';
//
//     var span_tag = document.createElement('span');
//     span_tag.className = 'msg';
//
//
//     if (chat_info.type === 'record') {
//         // 类型为  录音
//         var btn_tag = document.createElement('button');
//         btn_tag.className = 'btn btn-success';
//         btn_tag.onclick = function () {
//             document.getElementById('player').src = http_url + '/get_record/' + chat_info.record_name;
//         };
//         var record_tag = document.createElement('span');
//         record_tag.className = "glyphicon glyphicon-volume-up";
//         record_tag.innerText = '...';
//         btn_tag.appendChild(record_tag);
//         span_tag.appendChild(btn_tag);
//
//     } else if (chat_info.type === 'img') {
//         // 类型为  图片
//         var img_tag = document.createElement('img');
//         img_tag.style.width = '150px';
//         img_tag.src = http_url + '/get_img/' + chat_info.img_name;
//         span_tag.appendChild(img_tag);
//
//     } else {
//         // 类型为  文字
//         span_tag.innerText = chat_info.msg;
//     }
//
//
//     var strong_tag = document.createElement('strong');
//     strong_tag.className = 'form_user';
//     strong_tag.innerText = " : " + chat_info.nick;
//     var avatar_tag = document.createElement('img');
//     avatar_tag.src = http_url + '/get_avatar/' + chat_info.avatar;
//     avatar_tag.className = 'img-circle';
//     li_tag.appendChild(avatar_tag);
//     li_tag.appendChild(strong_tag);
//     li_tag.appendChild(span_tag);
//     ul_tag.appendChild(li_tag);
//
// }

// function create_my_chat(chat_info) {
//     //  三种类型  record  img  text
//
//     var ul_tag = document.getElementById("message_list");
//     var li_tag = document.createElement("li");
//     li_tag.className = 'list-group-item';
//
//     li_tag.style.textAlign = 'right';
//
//     var span_tag = document.createElement('span');
//     span_tag.className = 'msg';
//
//
//     if (chat_info.type === 'record') {
//         // 类型为  录音
//         var btn_tag = document.createElement('button');
//         btn_tag.className = 'btn btn-success';
//         btn_tag.onclick = function () {
//             document.getElementById('player').src = http_url + '/get_record/' + chat_info.record_name;
//         };
//         var record_tag = document.createElement('span');
//         record_tag.className = "glyphicon glyphicon-volume-up";
//         record_tag.innerText = '...';
//         btn_tag.appendChild(record_tag);
//         span_tag.appendChild(btn_tag);
//
//     } else if (chat_info.type === 'img') {
//         // 类型为  图片
//         var img_tag = document.createElement('img');
//         img_tag.style.width = '150px';
//         img_tag.src = http_url + '/get_img/' + chat_info.img_name;
//         span_tag.appendChild(img_tag);
//
//     } else {
//         // 类型为  文字
//         span_tag.innerText = chat_info.msg;
//     }
//
//     var strong_tag = document.createElement('strong');
//     strong_tag.className = 'form_user';
//     strong_tag.innerText = " : " + user_info.nick;
//     var avatar_tag = document.createElement('img');
//     avatar_tag.src = http_url + '/get_avatar/' + user_info.avatar;
//     avatar_tag.className = 'img-circle';
//     li_tag.appendChild(span_tag);
//     li_tag.appendChild(strong_tag);
//     li_tag.appendChild(avatar_tag);
//     ul_tag.appendChild(li_tag);
//
//
// }





