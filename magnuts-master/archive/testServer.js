var http = require('http')
var readline = require('readline')
//var html = "<head><meta charset='utf-8'></head>"
rl = readline.createInterface(process.stdin, process.stdout)
rl.setPrompt('Please Enter Something >')

var server = http.createServer(function (req, res){
	res.writeHead(200, {'content/type': 'text/plain'})
	rl.prompt()
	rl.on('line', function(line){
		res.end(line)
	}).on('close', function (){
		process.exit(0)
	}) 
	
}).listen(8081)

console.log('running on 8081~');