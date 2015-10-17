var http = require('http'),
	io = require('socket.io-client');

var fs = require('fs');

// var socket = io.connect('http://wangjiaqi.xyz:9002');
var socket = io.connect('http://localhost:9002');

var sendTime;

socket.on('connect', function () {
	console.log('Connected to server!');

	requestMap();
});


socket.on('test', function (msgObj) {
	// var receiveTime = Date.now();
	console.log('Messeage received: %d', msgObj.time);
	console.log('Delay: %d', (Date.now() - sendTime));
});

socket.on('send_map', function (msgObj) {
	console.log("Map received!");
	// console.log('Node 1 Seq: %s', msgObj.rails[0].radius);
	var nodes = msgObj.nodes;
	for (var i = 0; i < nodes.length; i++) {
		console.log(nodes[i].railSeq);
	}

})

socket.on('send_path', function (msgObj) {

})

function test() {
	var msgObj = {};
	sendTime = Date.now();
	msgObj.time = sendTime;
	console.log('Send @ %d', sendTime);
	socket.emit('test', msgObj);
}

function requestMap() {
	socket.emit('request_map', {})
}



// for(var i = 0; i < 10; i++) {
// 	setTimeout(test, i * 1000);
// }
