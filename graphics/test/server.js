var express = require('express'),
	app = express(),
	server = require('http').Server(app),
	io = require('socket.io')(server);

var port = 1337;

var game_sockets = {};
var controller_sockets = {};

app.use('/public', express.static(__dirname + '/public'));

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
		console.log('game socket id: ' + socket.id);
		socket.emit('game_connected');
	});

	socket.on('controller_connect', function(game_socket_id) {
		console.log('Controller socket id: ' + socket.id);
		if(game_sockets[game_socket_id] && !game_sockets[game_socket_id].controller_id){
			console.log('Controller connected...');

		controller_sockets[socket.id] = {
			socket: socket,
			game_id: game_socket_id
		};

		game_sockets[game_socket_id].controller_id = socket.id;

		game_sockets[game_socket_id].socket.emit('controller_connected', true);

		socket.emit('controller_connected', true);

		socket.on('controller_state_change', function(data) {
			if(game_sockets[game_socket_id]){
				game_sockets[game_socket_id].socket.emit('controller_state_change', data)	
			}
		});

		} else {
			console.log('Controller attempted to connect but failed...');

			socket.emit('controller_connected', false);
		}

	});

	socket.on('disconnect', function() {
		if(game_sockets[socket.id]){
			console.log('game disconnected!');

			if(controller_sockets[game_sockets[socket.id].controller_id]){
				controller_sockets[game_sockets[socket.id].controller_id].socket.emit("controller_connected", false);
				controller_sockets[game_sockets[socket.id].controller_id].game_id = undefined;
			}
			delete(game_sockets[socket.id]);
		}

		if(controller_sockets[socket.id]) {
			console.log('controller disconnected!');

			if(game_sockets[controller_sockets[socket.id].game_id]) {
				game_sockets[controller_sockets[socket.id].game_id].socket.emit('controller_connected', false);
				game_sockets[controller_sockets[socket.id].game_id].controller_id = undefined;
			}
			delete(controller_sockets[socket.id]);
		}	
	});

});

server.listen(port, function() {
	console.log('Server running on port: ' + port);
});