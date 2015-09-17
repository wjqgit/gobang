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

server.listen(port, function() {
	console.log('Server running on port: ' + port);
});