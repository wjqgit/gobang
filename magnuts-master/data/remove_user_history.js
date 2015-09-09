var mongojs = require('mongojs')

var uri = 'mongodb://localhost/testdb',
	db = mongojs.connect(uri,['uh'])

var uid = parseInt(process.argv[2]),
	barcode = parseInt(process.argv[3]),
	timeIn = parseInt(process.argv[4]),
	timeOut = parseInt(process.argv[5])

var pullModifier = {$pull: {}}
	
function removeUserHistory(uid, barcode, timeIn, timeOut){
	db.uh.find({'uid': uid}, function(err, docs){
		if (err){
			console.log('Error!');
			return
		}
		i = docs.length
		while(i--){
			j = docs[i].items.length
			k = j
			itemFound = false
			while(j-- && !itemFound){
				if (docs[i].items[j].barcode == barcode){
					pullModifier.$pull['items.' + j + '.times'] = {'timeIn': timeIn, 'timeOut': timeOut}
					db.uh.update({'uid': docs[i].uid}, pullModifier)
					console.log('Deleted!');
					itemFound = true
				}
			}
		}
	})
}

removeUserHistory(uid, barcode, timeIn, timeOut)