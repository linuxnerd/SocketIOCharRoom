var app = require('http').createServer(),
    io = require('socket.io').listen(app),
    util = require("util"),
    fs = require('fs'),
    user_list = {};
app.listen(process.env.PORT || 5000);


io.sockets.on('connection', function (socket) {
    function init_user_list(){
        socket.emit('init_user_list', user_list);
    }
    socket.on('login', function (data) {
        user_list[data.user_id] = data;
        socket.broadcast.emit('login', data);
    });
    socket.on('typing', function (data) {
        socket.broadcast.emit('typing', data);
    });
    socket.on('send_message', function (data) {
        socket.broadcast.emit('send_message', data);
    });
    socket.on('exit', function (data){
        delete user_list[data.user_id];
        socket.broadcast.emit('exit', data);
    });
    init_user_list();
});
