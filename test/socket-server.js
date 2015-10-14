var express = require('express'),
	app = express(),
	server = require('http').Server(app),
	io = require('socket.io')(server);

io.on('connection', function (socket) {
	console.log('A user connected...');

	socket.on('test', function(time) {
		socket.emit('test', Date.now());
	});
})


server.listen(9002, function () {
	console.log('Server running on port: 9002');
});
