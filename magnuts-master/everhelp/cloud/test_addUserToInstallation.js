var Parse = require('parse').Parse;

Parse.initialize("tOQcWFtNOQpSExXFPOAyRfdWw6HUw5tC4gxSiCib", "JmE2kQ6XJQUaFla71Gm4IpxOU931iLHHcgHNYgS5", "cNHfZXf6ke5wyyxrXXTpXYUxcnnzTqUMpAwW0RTG");

//baymax wjq's iPhone 6 Plus
//Tom tom's iPhone 5s
//hirohamada tom's iPad
//hiro xz's iPhone

Parse.Cloud.run('addUserToInstallation', {
    username: 'hiro',
    deviceToken: '5a07dd1987eea33156efa12124b50c27d7324a18af28b13c786892b6d5312b84'
},{
    success: function(installation) {
    	console.log('Successful!');
    },
    error: function(error) {
    	console.log('Error!');
    }
}
)