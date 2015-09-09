var fs = require('fs'),
	express = require('express')
var host = "127.0.0.1",
	port = 1337

var app = express()
app.use(express.static(__dirname))

app.get("/", (function(req, res){
	res.send('hello world!')	
})).listen(port, host)