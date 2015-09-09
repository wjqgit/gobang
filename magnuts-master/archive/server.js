var express = require('express');
var app = express();

var port = 3777;

app.get('/testing', function(req, res) {
    res.send("hello world");
});

app.post('/login', function(req, res) {
    res.send("{\"xmpp\":{\"user\":\"cb229wvt68u@xmpp-server1\",\"password\":\"U86TVW92-2BC\",\"proxy\":\"proxy@xmpp1.entone.com\",\"domain\":\"192.168.1.144\"},\"notification\":{\"domain\":\"notification-fusionhome.entone.com/alert\"},\"relay\":{\"servers\":[{\"url\":\"http://relay.fusionhome.entone.com/hlsUpload\"}]},\"service_list\":{\"setting\":true,\"control\":false}}");
});

app.listen(port);
console.log('Express started on port '+port);
