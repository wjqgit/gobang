var http = require('http'),
  express = require('express');

var ip = '127.0.0.1',
  port=3000;

var app = express();

var server = http.Server(app);

app.use(express.static(__dirname));


server.listen(port, ip, () => {
  console.log('Server running on %s:%d', ip, port);
})
