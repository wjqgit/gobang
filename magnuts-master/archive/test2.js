var http = require('http')
var readline = require('readline')

var rl = readline.createInterface(process.stdin, process.stdout)

rl.setPrompt('Enter a Barcode> ')
rl.prompt()

rl.on('line', function(line){
	var url = "http://localhost:8082/?barcode="
	url += line.toString()
	http.get(url, function(res){
		res.setEncoding('utf8')
		res.on('data', function(chunk){
			console.log(chunk)
			rl.prompt()
		})
		res.on('err',console.error)
	})
})
