var http = require('http')
var readline = require('readline')
var url = "http://localhost:8082/?barcode="

var rl = readline.createInterface({
	input: process.stdin,
	output: process.stdout
})

rl.question("Enter a valid barcode: ", function (answer){
	if(answer == 'close'){
		process.exit()
	}

	url += answer.toString()
	console.log(url)
	http.get(url, function(res){
		res.setEncoding('utf8')
		res.on('data',console.log)
		res.on('err',console.error)
	})
	rl.close()
})

