var mongojs = require('mongojs')

var uri = 'mongodb://localhost/testdb',
	db = mongojs.connect(uri,['uh'])

var uid = parseInt(process.argv[2]),
	barcode = parseInt(process.argv[3]),
	timeIn = parseInt(process.argv[4]),
	timeOut = parseInt(process.argv[5])

var setModifier = {$set: {}}
var pushModifier = {$push: {}}

function addUserHistory(uid, barcode, timeIn, timeOut){
	db.uh.find({"uid": uid}, function(err, docs){
		if (err){
			console.log('Error! User not found!');
			return
		}
		i = docs.length
		while(i--){
			var j = docs[i].items.length
			var k = j
			var itemFound = false
			while(j-- && !itemFound){
				if (docs[i].items[j].barcode == barcode){
					pushModifier.$push['items.' + j + '.times'] = {"timeIn": timeIn, "timeOut": timeOut}
					db.uh.update({"uid": docs[i].uid,}, pushModifier)
					console.log('Added!');
					itemFound = true
				}	
			}
			if (!itemFound){
				setModifier.$set['items.' + k + '.barcode'] = barcode
				pushModifier.$push['items.' + k + '.times'] = {"timeIn": timeIn, "timeOut": timeOut}
				db.uh.update({"uid": docs[i].uid}, setModifier)
				db.uh.update({"uid": docs[i].uid}, pushModifier)
				console.log('Added!');
			}
		}
	})
}

addUserHistory(uid, barcode, timeIn, timeOut)