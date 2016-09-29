var http = require('http'),
	io = require('socket.io-client');

var socket = io.connect('http://localhost:9002');

socket.on('connect', function () {
	console.log('Connected to server!');
});

socket.on('test', function (msgObj) {
	// var receiveTime = Date.now();
	console.log('Messeage received');
});

function test() {
	var array = [];
  var obj = {};
  obj.time = Date.now();
  array[0] = obj;
	console.log('Send : %d', obj.time);
	socket.emit('test', array);
}

for(var i = 0; i < 10; i++) {
	setTimeout(test, i * 1000);
}
