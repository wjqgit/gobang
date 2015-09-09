var Parse = require('parse').Parse;
 
Parse.initialize("tOQcWFtNOQpSExXFPOAyRfdWw6HUw5tC4gxSiCib", "JmE2kQ6XJQUaFla71Gm4IpxOU931iLHHcgHNYgS5", "cNHfZXf6ke5wyyxrXXTpXYUxcnnzTqUMpAwW0RTG");
 
//var query = new Parse.Query(Parse.User);

Parse.Cloud.run('modifyUserCash', {user: 'wjq', value: -100}, {
	success: function(users){
	},
	error: function(error){
	}
})