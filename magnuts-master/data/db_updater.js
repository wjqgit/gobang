var mongojs = require('mongojs')
	
var uri = "mongodb://localhost/testdb",
	db = mongojs.connect(uri, ["test"])

var life = process.argv[2]

function addLife(life){
	db.test.find(function(err, docs){
		if(err){
			console.log('Error!')
			return
		}
		i = docs.length
		while(i--){
			db.test.update({"_id":docs[i]._id},{$set:{"life": life}})
		}
	})
}

addLife(life)