var http = require('http');
var ip = '127.0.0.1',
	port = 3000

http.createServer(function (req, res) {
  res.writeHead(200, {'Content-Type': 'text/plain'});
  res.end('Hello World\n');
}).listen(port, ip, function() {
	console.log('Server running on %s:%d', ip, port);	
});
