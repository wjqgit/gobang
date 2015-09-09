
// Use Parse.Cloud.define to define as many cloud functions as you want.
// For example:
Parse.Cloud.define("test", function(request, response) {
  response.success("This is WJQ!");
});


Parse.Cloud.define('viewUser', function(request, response){
	var query = new Parse.Query('User')
	query.equalTo('username', request.param.user)
	query.find({
		success: function(users){
			if (users.length > 1){
				response.error('Error! Multiple Users Found!');
				return
			}
			response.success('User: ' + users[0].get('username'))
			response.success('Cash: ' + users[0].get('cash'));
		},
		error: function() {
			response.error('User Lookup Failed!')
		}
	})
})
