var Parse = require('parse').Parse;
 
Parse.initialize("tOQcWFtNOQpSExXFPOAyRfdWw6HUw5tC4gxSiCib", "JmE2kQ6XJQUaFla71Gm4IpxOU931iLHHcgHNYgS5");
 
var query = new Parse.Query(Parse.User);

/*
Parse.Cloud.run('viewUser', { user: 'baymax' }, {
  success: function(users) {
  },
  error: function(error) {
  }
});
*/

Parse.Cloud.run('modifyUserCash', {user: 'wjq', value: 100}, {
	success: function(users){
	},
	error: function(error){
	}
})
