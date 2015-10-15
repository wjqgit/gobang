var http = require('http'),
	io = require('socket.io-client');

var socket = io.connect('http://wangjiaqi.xyz:9002');

var sendTime;

socket.on('connect', function () {
	console.log('Connected to server!');
});


socket.on('test', function (msgObj) {
	// var receiveTime = Date.now();
	// console.log('Delay %d', (receiveTime - sendTime));
	console.log('Messeage received at: %d', msgObj.time);
});

function test() {
	var msgObj = {};
	sendTime = Date.now();
	msgObj.time = sendTime;
	console.log('Send @ %d', sendTime);
	socket.emit('test', msgObj);
}

for(var i = 0; i < 100; i++) {
	setTimeout(test, i * 100);
}
