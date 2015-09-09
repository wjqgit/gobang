var Parse = require('parse').Parse;

Parse.initialize("tOQcWFtNOQpSExXFPOAyRfdWw6HUw5tC4gxSiCib", "JmE2kQ6XJQUaFla71Gm4IpxOU931iLHHcgHNYgS5");

//var query = new Parse.Query(Parse.User);
var i = 32

Parse.Cloud.run('modifyNote', {
    title: 'strong guy needed',
    //+ i.toString(),
    status: 'completed'
}, {
    success: function(notes) {
        console.log('Successful!');
    },
    error: function(error) {
        console.log('Failed');
    }
})

/*
Parse.Cloud.run('modifyNote', {
    title: 'Testing ' + i.toString(),
    helpername: 'Tom',
    status: 'accepted'
}, {
    success: function(notes) {
		console.log('Successful!');
    },
    error: function(error) {
		console.log('Failed');
    }
})
*/