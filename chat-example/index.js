var app = require('express')(),
	http = require('http').Server(app),
	io = require('socket.io')(http);

var user_count = 0;

app.get('/', (function(req, res){
	res.sendFile(__dirname + '/index.html');
}));

io.on('connection', function(socket) {
	console.log('a user connected...');
	var user_id = "user0" + (++user_count);
	socket.emit('chat message', "hello, " + user_id);
	socket.broadcast.emit('chat message', user_id + " connected...");
	socket.on('disconnect', function() {
		console.log(user_id + ' disconnected...');
	});
	socket.on('chat message', function(msg) {
		// console.log('message: ' + msg);
		io.emit('chat message', user_id + ": " + msg);
	});
});

http.listen(3000, function() {
	console.log('http server running on port 3000...');
});