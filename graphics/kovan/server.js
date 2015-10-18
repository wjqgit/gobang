var express = require('express'),
	app = express(),
	server = require('http').Server(app),
	io = require('socket.io')(server),
	io_client = require('socket.io-client');

var port = 9003;

app.set('trust proxy', true);

app.use('/public', express.static(__dirname + '/public'));

app.get('/', function(req, res) {
	res.sendFile(__dirname + '/index.html');
});

app.get('/:tagId', function(req, res) {
	res.sendFile(__dirname + '/' + req.params.tagId + '.html');
});

// SERVER
var server_socket;

io.on('connection', function (socket) {
	console.log('A user connected...');

	server_socket = socket;
	// TEST
	socket.on('test', function (time) {
		// console.log(time);
		client_socket.emit('test', Date.now());
	});
});

server.listen(port, function() {
	console.log('Server running on port: ' + port);
});

// CLIENT
var client_socket = io_client.connect('http://localhost:9002');

client_socket.on('connect', function () {
	console.log('Connected to server at port 9002.');
})

client_socket.on('test', function (time) {
	server_socket.emit('test', Date.now());
})
