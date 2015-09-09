var Parse = require('parse').Parse;
 
Parse.initialize("tOQcWFtNOQpSExXFPOAyRfdWw6HUw5tC4gxSiCib", "JmE2kQ6XJQUaFla71Gm4IpxOU931iLHHcgHNYgS5", "cNHfZXf6ke5wyyxrXXTpXYUxcnnzTqUMpAwW0RTG");
var point = new Parse.GeoPoint(30.01, 30.01)

Parse.Cloud.run('modifyUser', {
	username: 'wjq',
	status: null,
	cash: 99999,
	location: point
},{
    success: function(user) {},
    error: function(error) {}
}
)