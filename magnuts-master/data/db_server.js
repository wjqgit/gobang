var http = require('http'),
    mongojs = require('mongojs'),
    url = require('url')

var uri = "mongodb://localhost/testdb",
    db = mongojs.connect(uri, ["test","nl"])

var server = http.createServer(function(req, res) {
    var barcode = url.parse(req.url, true).query['barcode']
    barcode = parseInt(barcode)
    var nl = url.parse(req.url, true).query['nl']
    nl = parseInt(nl)
    res.writeHead(200, {
        'content-type': 'text/html'
    })
    if (barcode) {
        db.test.find({
            "barcode": barcode
        }, function(err, records) {
            if (err) {
                console.log("Error!")
                res.end()
                return
            }
            var html = '<head><meta charset=\'utf-8\'></head>'
            html += '<h1>Item Search</h1>'
            i = records.length
            html += '<h2>Item Found</h2>'
            while (i--) {
                html += '<p><b>Barcode:</b> ' + records[i].name + ' <br /><b>Spec:</b> ' + records[i].spec + ' <br /><b>Origin:</b> ' + records[i].origin + ' <br /><b>Price:</b> ' + records[i].retailPrice + ' <br /><b>Shelf Life:</b> ' + records[i].life + ' <br /><b>Category ID:</b> ' + records[i].categoryId
            }
            res.end(html)
        })
    } else if (nl) {
        db.nl.find({
            "categoryId": nl
        }, function(err, records) {
            if (err) {
                console.log("Error!")
                res.end()
                return
            }
            var html = '<head><meta charset=\'utf-8\'></head>'
            html += '<h1>Nutrition Label Search</h1>'
            i = records.length
            html += '<h2>Nutrition Label Found</h2>'
            while (i--) {
            	for(var key in records[i]){
           			html += '<p>'
            		if (records[i].hasOwnProperty(key) && records[i][key] != ""){
            		//	console.log(key);
            		//	console.log(typeof records[i][key]);
            			html += '<b>'+ key.toString() + ':</b>'+ records[i][key].toString() + '<br />'
            		}
            	}
            }
            res.end(html)
        })
    }


})

server.listen(8082)
console.log("Server running @ port 8082")