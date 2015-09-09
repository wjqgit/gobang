var Parse = require('parse').Parse;

Parse.initialize("tOQcWFtNOQpSExXFPOAyRfdWw6HUw5tC4gxSiCib", "JmE2kQ6XJQUaFla71Gm4IpxOU931iLHHcgHNYgS5");

var query = new Parse.Query(Parse.User);
/*
query.find({
  success: function(users) {
    for (var i = 0; i < users.length; ++i) {
      console.log('User: ' + users[i].get('username'));
      console.log('Cash: ' + users[i].get('cash'));
    }
  }
});
*/


function viewUser(user) {
    query.equalTo('username', user)
    query.find({
        success: function(users) {
            if (users.length > 1) {
                console.log('Error! Multiple Users Found!');
                return
            }
            console.log('User: ' + users[0].get('username'))
            console.log('Cash: ' + users[0].get('cash'));
            console.log('ID: ' + users[0].get('objectId'));
        }
    })
}

//viewUser('wjq')


function modifyUserCash(input, callback) {
    query.equalTo('username', input.user)
    query.first({
        success: function(user) {
            console.log('|---Original Value---|');
            console.log('User: ' + user.get('username'))
            console.log('Cash: ' + user.get('cash'));
            current = user.get('cash')
            current += input.value
            user.set('cash', current)
            console.log('|---Current Value---|');
            console.log('User: ' + user.get('username'))
            console.log('Cash: ' + user.get('cash'));
            user.save(null, {
                success: function(user) {
                    console.log('Success!');
                    callback.success()
                },
                error: function(user, error) {
                    console.log('Error!');
                    callback.error(error.message)
                }
            })
        }
    })
}
/*
Parse.Cloud.beforeSave('User', function(request, response) {
        modifyUserCash('wjq', 100, 
                {
                    success: function() {
                        response.success()
                    },
                    error: function() {
                        response.error()
                    }
                }
            )
})
*/

//Test to add a note

viewUser('wjq')



