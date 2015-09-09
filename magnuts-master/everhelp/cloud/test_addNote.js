var Parse = require('parse').Parse;

Parse.initialize("tOQcWFtNOQpSExXFPOAyRfdWw6HUw5tC4gxSiCib", "JmE2kQ6XJQUaFla71Gm4IpxOU931iLHHcgHNYgS5","cNHfZXf6ke5wyyxrXXTpXYUxcnnzTqUMpAwW0RTG");

var point = new Parse.GeoPoint(22.33575659 + 0.001, 114.26385331 + 0.002)
var query = new Parse.Query(Parse.User);
var i = 44

Parse.Cloud.run('addNote', {
    username: 'Jiaqi',
    title: 'Testing ' + i.toString(),
    content: 'This is test round ' + i.toString(),
    reward: 250,
    location: point,
    status: 'sent'
}, {
    success: function(notes) {
    	console.log('Successful!');
    },
    error: function(error) {
    	console.log('Failed!');
    }
})