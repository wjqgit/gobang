var Parse = require('parse').Parse;

Parse.initialize("tOQcWFtNOQpSExXFPOAyRfdWw6HUw5tC4gxSiCib", "JmE2kQ6XJQUaFla71Gm4IpxOU931iLHHcgHNYgS5", "cNHfZXf6ke5wyyxrXXTpXYUxcnnzTqUMpAwW0RTG");

var userQuery = new Parse.Query(Parse.User)
userQuery.equalTo('username', 'hirohamada')

var pushQuery = new Parse.Query(Parse.Installation)
pushQuery.matchesQuery('user', userQuery)

var query = new Parse.Query(Parse.Installation)
    /*
Parse.Push.send({
	where: pushQuery,
	data: {
		alert: "This is WJQ!"
	}
},{
	success: function(){
		console.log('Push Sucessful!');
	},
	error: function(){
		console.log('Error!')
	}
}
)
*/
/*
Parse.Push.send({
    channels: ['global'],
    data: {
        alert: "This is WJQ!"
    }
}, {
    success: function() {
        console.log('Push Sucessful!');
    },
    error: function() {
        console.log('Error!')
    }
})
*/
