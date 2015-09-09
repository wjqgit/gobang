var http = require('http') ;
var portNumber = 8080 ;
var server = http.createServer(function callback (req, res){
	res.writeHead(200, {'Content-Type': 'text/plain'});
	res.end('Hello world!\n')
})

server.listen(8080, '127.0.0.1')
console.log('Server running at http://127.0.0.1:8080');

