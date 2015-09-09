var http = require('http'),
    mongojs = require('mongojs'),
    url = require('url')
    getSpec = require('get_spec.js')

var uri = "mongodb://localhost/testdb",
    db = mongojs.connect(uri, ["test", "nl", "uh"])
    //Test How to add Shelf Life to a specific item	
    /*
var barcode = process.argv[2],
	life = process.argv[3]

function addLife(barcode, life){
	db.test.find({"barcode":barcode},function(err,records){
		if(err){
			return callback(err)
		}
		i = records.length
		while(i--){
			db.test.update({"_id":records[i]._id},{$set:{"life": life}})
		}
})
}**/

/*Test how to parse url
var server = http.createServer(function(req, res){
	var barcode = url.parse(req.url, true).query['barcode']
	barcode = parseInt(barcode)
	var nl = url.parse(req.url, true).query['nl']
	nl = parseInt(nl)
	if(barcode){
		console.log("Barcode: " + barcode);
		db.test.find({'barcode': barcode}, function(err,records){
			var a = records[0]
			console.log(a)
		})
	} 
	else if(nl){
		console.log("NutritionID: " + nl)
		db.nl.find({'categoryId': nl}, function(err,records){
			var a = records[0]
			for (var key in records[0]){
				if(records[0].hasOwnProperty(key)){
					console.log(key);
				}
			}
			console.log(a.length)
		})	
	} 
})
server.listen(8083)
console.log('Server running on port 8083~');*/

//Test how to access element in an array
/*
function test(uid){
	db.uh.find({"uid": uid}, function (err, docs){
		if (err){
			console.log('Error!')
			return
		}
		i = docs.length
		while(i--){
			j = docs[i].items.length
			while(j--){
				console.log(docs[i].items[j].barcode);	
			}
			
		}	
		//db.uh.update({"uid": docs[0].uid, "items.barcode": 6920952762990},{$push: {"items.times": {"timeIn": 12345678, "timeOut": 23456789}}})
		var setModifier = {$set:{}}
		var pushModifier = {$push:{}}
		/*
		var k = 0
		setModifier.$set['items.' + k + '.times'] = "bbb"
		pushModifier.$push['items.' + k + '.times'] = {"timeIn": 123456, "timeOut": 234567}
		db.uh.update({"uid": docs[0].uid}, pushModifier)
		*/
//db.uh.update({"uid": docs[0].uid}, {$push: {'items.2.barcode': 111, 'items.2.times': {'timeIn': 222, 'timeOut': 333}}})
/*
		setModifier.$set['items.' + 2 + '.barcode'] = 444
		pushModifier.$push['items.' + 2 + '.times'] = {"timeIn": 555, "timeOut": 666}
		db.uh.update({"uid": docs[0].uid}, setModifier)
		db.uh.update({"uid": docs[0].uid}, pushModifier)
	})
}

test(100001)*/

//Test forEach
/*
function counter(times, timeStart, timeEnd) {
    count = 0
    times.forEach(function(element) {
        if (element.timeIn < timeEnd && element.timeOut > timeStart) {
            count++
        }
    })
}
times = [{
    "timeIn": 20150217,
    "timeOut": 20150317
}, {
    "timeIn": 20150224,
    "timeOut": 20150324
}, {
    "timeIn": 20150301,
    "timeOut": 20150331
}, {
    "timeIn": 20150331,
    "timeOut": 20150412
}, {
    "timeIn": 20150413,
    "timeOut": 20150431
}]
counter(times, 20150101, 20150501)
*/

//Can I use a variable as the key of a dictionary
/*
db.nl.find({
    'categoryId': 2000001
}, function(err, docs) {
    if (err) {
        console.log('Nutrition Label Not Found!');
        return
    }
else if (docs.length > 1) {
    console.log('Multiple Entries Found!');
    return
}
	a = 'energy'
	console.log(docs[0][a])
	console.log(typeof docs[0][a]);
})
*/

//Test getSpec Module
barcode = 6942980800260
getSpec(barcode, function(err, docs) {
    if (err) {
        console.log('Error!!');
        return
    } else if (docs.length > 1) {
        console.log('Multiple Entries Found!');
        return
    }
    console.log(docs.total)
})