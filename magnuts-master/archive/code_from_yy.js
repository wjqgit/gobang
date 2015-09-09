var http = require('http')
var fs = require('fs')
var port = 8000
var userKeyDB = '/Users/dt/nodejs'
function searchUserDB(userValue){

}

function searchitemDB(itemValue){

}

function searchDB(userValue, itemValue){
	if (searchUserDB(userValue)){
		if (searchitemDB(itemValue))
			return itemDataBase(itemValue)
		else{

			console.log("No such item!")
			return false
		}
	}
	else{
		console.log('No such user!')
		return false
	}
}

function httpGetItem(){
	var server = http.createServer(function (req,res){
		var body = ''
		var userValue = 0
		var itemValue = 0
		var result
		req.setEncoding('utf8')
		req.on('data', function(file){body += file})
		req.on('end', function(){
			try{
				var data = JSON.parse(body, function (k, v){
				if (k == ('User' || 'user' || 'USER'))
					userValue = v;
				else if (k = 'Item' || 'item' || 'ITEM')
					itemValue = v;
				})
			}
			catch(er){
				res.statusCode = 400
				return res.end('error:'+er.message)
			}
			result = searchDB(userValue, itemValue)
			if(result){
				res.writeHead(200, {'Content-Type': 'application/json'})
				res.end(JSON.stringify(result))
			}
			else{
				res.writeHead(404)
				res.end('error!')
			}
		})
	})
}