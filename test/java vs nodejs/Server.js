var http=require('http');  
var server=new http.Server();  
server.on('request',function(req,res){  
    res.writeHead(200,{'Content-Type':'text/html'});  
    res.end('<h1>http test</h1>');  
});  
  
server.listen(80);  
console.log('HTTP SERVER is LISTENING AT PORT 80.');  