var express = require('express'),
  app = express(),
  server = require('http').createServer(app);

var ip = '127.0.0.1',
// var ip = '192.168.199.233',
// var ip = '10.0.0.10',
  port = 8888;


server.listen(port, ip, function() {
  console.log('Server running on %s:%d', ip, port);
})

app.use(express.static(__dirname));
