var http = require('http')
var url = "http://localhost:8082/?barcode=6920927181122"

http.get(url, function(res){
	res.setEncoding('utf8')
	res.on('data',console.log)
	res.on('err',console.error)
})
