var express = require('express'),
 app = express(),
 server = require('http').Server(app),
 io = require('socket.io')(server);

var fs = require('fs');

server.listen(9002, function () {
  console.log('Server running on port: 9002');
});

io.on('connection', function (socket) {
  console.log('User connected.');

  socket.on('test', function(array) {
   console.log('Message received : %d', array[0].time);
   socket.emit('test', Date.now());
  });

  socket.on('request_map', function() {
    socket.emit('send_map', map);
  })

  socket.on('disconnect', function() {
    console.log('User disconnected.');
  })
})

var map;
var path;

fs.readFile('map.json', 'utf-8', function (err, data) {
  if (err) throw err;
  map = JSON.parse(data);
  console.log('Successfully loaded map!');
})

fs.readFile('path.json', 'utf-8', function (err, data) {
  if (err) throw err;
  path = JSON.parse(data);
  console.log('Successfully loaded path!');
})
