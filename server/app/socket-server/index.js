'use strict';

var init = function(app){
	var server 	= require('http').Server(app);
	var io 		= require('socket.io')(server);

	// Force Socket.io to ONLY use "websockets"; No Long Polling.
	io.set('transports', ['websocket']);

	// Define all Events
	io.sockets.on('connection', function (socket) {
        socket.on('startlisten', function (data) {
            const room = 1;
            socket.join(room);
            io.sockets.in(room).emit('notification', 'xin chào');
        });
        socket.on('disconnect', function (data) {
            var roomIds = socket.room ? socket.room.split(",") : undefined;
            if (roomIds)
                for (var i = 0; i < roomIds.length; i++){
                    if (roomIds[i])
                    {
                        io.sockets.in(roomIds[i]).emit('clearnotification', socket.id);
                    }
                }
        });
        socket.on('notification', function (data) {
            const room = 1;
            socket.join(room);
            console.log('notification', data);
            io.sockets.in(room).emit('notification', data);
        });
        socket.on('notification-typing', function (data) {
            const room = 1;
            socket.join(room);
            console.log('notification-typing', data);
            io.sockets.in(room).emit('notification-typing', data);
        });
    });

	// The server object will be then used to list to a port number
	return server;
}

module.exports = init;