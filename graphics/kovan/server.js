var express = require('express'),
	app = express(),
	server = require('http').Server(app),
	io = require('socket.io')(server);

var port = 9001;

app.use('/public', express.static(__dirname + '/public'));

app.get('/', function(req, res) {
	res.sendFile(__dirname + '/index.html');
});

app.get('/:tagId', function(req, res) {
	res.sendFile(__dirname + '/' + req.params.tagId + '.html');
});

io.on('connection', function (socket) {
	console.log('A user connected..');

	socket.on('test', function (time) {
		// console.log(time);
		socket.emit('test', Date.now());
	});
});

server.listen(port, function() {
	console.log('Server running on port: ' + port);
});