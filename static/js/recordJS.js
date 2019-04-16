$(function () {
    var reco = null;

    //音频内容对象  所有的 存入的 声音 以及 需要播放的 声音
    var audio_context = new AudioContext();
    // 浏览器的 用户媒体对象
    navigator.getUserMedia = (
        navigator.getUserMedia ||   // 兼容谷歌  可能 会不好用
        navigator.webkitGetUserMedia ||  // 兼容 火狐
        navigator.mozGetUserMedia ||  // 兼容 opera
        navigator.msGetUserMedia);  // 兼容 IE
    // 拿到所有用户的 媒体对象  audio: true 调用音频设备 vidio: true  调用摄像头
    // create_stream  对象执行成功 后执行的 方法
    navigator.getUserMedia({audio: true}, create_stream, function (err) {
        // 对象执行失败 执行的 内容
        console.log(err)
    });

    // navigator.getUserMedia  整个的  对象 就是这个函数的 参数  user_media
    function create_stream(user_media) {
        // 函数 创建一个流容器
        // createMediaStreamSource  流媒体容器
        var stream_input = audio_context.createMediaStreamSource(user_media);
        // 准备麦克风  还未开启
        reco = new Recorder(stream_input);
    }


    // 开是录音
    $('#start_record').click(function () {

        // var from_user = document.getElementById("from_id").innerText;
        if (user_info) {
            // console.log(2222222222);
            reco.record();
        } else {
            alert('请登录!')
        }

    });

    // 停止录音
    $("#stop_record").click(function () {

        var from_user = document.getElementById("from_id").innerText;
        if (from_user) {
            reco.stop();
            var to_user = document.getElementById('to_user').innerText;

            // 获取容器中的 内容
            reco.exportWAV(function (wav_file) {
                console.log(wav_file);  // Blob 对象
                var form_data = new FormData();
                form_data.append('audio', wav_file);
                form_data.append("from_user", from_user);
                form_data.append("to_user", to_user);
                form_data.append("type", 'record');

                $.ajax({
                    url: http_url + "/upload_record",
                    type: 'post',
                    processData: false,
                    contentType: false,
                    data: form_data,
                    dataType: 'json',
                    success: function (res) {
                        console.log(res);
                        if (res.code === 0) {
                            var send_msg = {
                                to_user: to_user,
                                from_user: from_user,
                                record_name: res.data.record_name,
                                type: 'record',
                                nick: user_info.nick,
                                avatar: user_info.avatar,
                            };
                            ws.send(JSON.stringify(send_msg));
                            document.getElementById('player').src = http_url + '/get_record/send_success.mp3';

                            // 添加到聊天 窗口中

                            create_chat({
                                type: 'record',
                                record_name: res.data.record_name,
                                from_user: user_info._id,
                                avatar: user_info.avatar,
                                nick: user_info.nick
                            })
                        }
                    }
                })
            });
            reco.clear()
        } else {
            alert('请登录!')
        }
    });
});