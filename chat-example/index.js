var app = require('express')(),
	http = require('http').Server(app),
	io = require('socket.io')(http);

var user_count = 0;

app.get('/', (function(req, res){
	res.sendFile(__dirname + '/index.html');
}));

io.on('connection', function(socket) {
	console.log('a user connected...');
	socket.emit('chat message', "you are user #" + (++user_count))
	socket.broadcast.emit('chat message', "user #" + user_count + " connected...");
	socket.on('disconnect', function() {
		console.log('user disconnected...');
	});
	socket.on('chat message', function(msg) {
		// console.log('message: ' + msg);
		io.emit('chat message', msg);
	});
});

http.listen(3000, function() {
	console.log('http server running on port 3000...');
});