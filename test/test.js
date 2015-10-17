var http = require('http'),
	io = require('socket.io-client');

// var socket = io.connect('http://wangjiaqi.xyz:9002');
var socket = io.connect('http://localhost:9002');

var sendTime;

socket.on('connect', function () {
	console.log('Connected to server!');
});


socket.on('test', function (msgObj) {
	// var receiveTime = Date.now();
	console.log('Messeage received: %d', msgObj.time);
	console.log('Delay: %d', (Date.now() - sendTime));
});

socket.on('send-map' function (msgObj) {
	console.log("Map received!");
	console.log('Node 1 Seq: %s', msg.nodes[0].getId());
})

function test() {
	var msgObj = {};
	sendTime = Date.now();
	msgObj.time = sendTime;
	console.log('Send @ %d', sendTime);
	socket.emit('test', msgObj);
}

function requestMap() {
	socket.emit('requestMap', {})
}

// for(var i = 0; i < 10; i++) {
// 	setTimeout(test, i * 1000);
// }
