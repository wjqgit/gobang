var Parse = require('parse').Parse;
 
Parse.initialize("AnCy7AGUugHMGQE9uInlUdICFUQqmc3fwov4tQ6V", "SAuDzXAwDq7PxIWwN8vyh7X16RpdhE9tPVrdZ1K2");

var geo = new Parse.GeoPoint(0.0, 0.0);
var query = new Parse.Query(Parse.User);

query.equalTo('location', geo)
query.find({
	success: function(users){
		console.log(users[0].get('username'));
	}
})
