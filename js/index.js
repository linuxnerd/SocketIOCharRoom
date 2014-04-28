$(function (){
    // action_id对应关系：
    // 0 => 用户登录
    // 1 => 发送消息
    // 2 => 正在输入
    // 3 => 用户注销
    //
    //
    // TODO:
    // - 打开页面用户名输入框焦点必须自动在输入框
    // - 输入用户名后焦点在消息输入框
    var win = window,
        doc = document,
        socket,
        user_data = {},
        user_name = $("#user_name"),
        remote_ip = "192.168.33.10",
        remote_port = 9000
        chat_buffer = $("#chat_buffer"),
        chat_submit = $("#chat_submit"),
        modal = $("#user_name_input"),
        user_name_init = $("#user_name_init"),
        user_name_confirm = $("#user_name_confirm"),
        user_list = $("#user_list"),
        user_list_item_template = $("#user_list_item").html();

    function id_creater() {
        function s4() {
            return Math.floor((1 + Math.random()) * 0x10000)
                   .toString(16)
                   .substring(1);
        }
        return s4() + s4() + '-' + s4() + '-' + s4() + '-' +
               s4() + '-' + s4() + s4() + s4();
    }
    user_data.user_id = id_creater();
    socket = io.connect("http://" + remote_ip + ":" + remote_port);
    modal.modal();

    function login_callback(e){
        user_data.user_name = user_name_init.val() ? user_name_init.val() : "匿名用户";
        user_data.action_id = 0;
        user_data.message = "";
        socket.emit("login", user_data);
        user_name.html(user_data.user_name);
        user_list.append(Mustache.to_html(user_list_item_template, {user_list : [user_data]}));
    }

    function update_session(data){
        var session =  $("#session"),
            template = data.user_id === user_data.user_id ? $("#msg_box_from_me").html() : $("#msg_box_from_origin").html();
        session.append(Mustache.to_html(template, data));
        session.scrollTop(session[0].scrollHeight);
    }

    user_name_init.bind("keypress", function (e){
        if(e.keyCode != 13){
            return;
        }
        login_callback(e);
        modal.modal("hide");
    });
    user_name_confirm.bind("click", login_callback);
    chat_buffer.bind("keypress", function(e){
        if(!user_data.user_name){
            login_callback();
        }
        if(e.keyCode != 13){
            user_data.action_id = 2;
            socket.emit('typing', user_data);
        }else{
            if(!chat_buffer.val()){
                return;
            }
            user_data.action_id = 1;
            user_data.message = chat_buffer.val();
            socket.emit('send_message', user_data);
            update_session(user_data);
            chat_buffer.val("");
        }
    });

    socket.on("init_user_list", function (data){
        var user_list_arr = [];
        if(!_.size(data)){
            return;
        }
        _.each(data, function (item){
            user_list_arr.push(item);
        })
        user_list.html(Mustache.to_html(user_list_item_template, {user_list : user_list_arr}));
    });

    socket.on("send_message", update_session);

    socket.on("login", function (data){
        user_list.append(Mustache.to_html(user_list_item_template, {user_list : [data]}));
    })
    socket.on("typing", function (data){
        var input_status = user_list.find("li[user_id=" + data.user_id + "]").find(".status");
        input_status.html("  正在输入...");
        setTimeout(function (){
            input_status.html("");
        }, 2000);
    })

    socket.on("exit", function (data){
        user_list.find("li[user_id=" + data.user_id + "]").hide(500, function (){
            $(this).remove();
        });
    })

    $(win).bind("beforeunload", function (){
        user_data.action_id = 3;
        socket.emit('exit', user_data);
    });
    $(win).bind("unload", function (){
        user_data.action_id = 3;
        socket.emit('exit', user_data);
    });
});
