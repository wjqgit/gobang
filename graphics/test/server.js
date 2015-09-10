var express = require('express'),
	app = express(),
	server = require('http').Server(app),
	io = require('socket.io')(server);

var port = 1337;

var game_sockets = {};
var controller_sockets = {};

app.use(express.static(__dirname));

app.get('/', function(req, res) {
	res.sendFile(__dirname + '/index.html');
});

io.on('connection', function(socket) {
	// console.log('A user connected...');

	socket.on('game_connect', function() {
		console.log('Game connected...');
		game_sockets[socket.id] = {
			socket: socket,
			controller_id: undefined
		};
		console.log(game_sockets[socket.id]);
		socket.emit('game_connected');
	});

	socket.on('controller_connect', function(game_socket_id) {
		console.log(game_sockets[game_socket_id]);
		if(game_sockets[game_socket_id] && !game_sockets[game_socket_id].controller_id){
			console.log('Controller connected...');

		controller_sockets[game_socket_id] = {
			socket: socket,
			game_id: game_socket_id
		};

		game_sockets[game_socket_id].controller_id = socket.id;

		game_sockets[game_socket_id].socket.emit('controller connected', true);

		socket.emit('controller_conneted', true);
		} else {
			console.log('Controller attempted to connect but failed...');

			socket.emit('controller_connected', false);
		}
	});


});

server.listen(port, function() {
	console.log('Server running on port: ' + port);
});