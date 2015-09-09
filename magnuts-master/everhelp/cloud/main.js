// Use Parse.Cloud.define to define as many cloud functions as you want.
// 
// For example: 
Parse.Cloud.define("hello", function(request, response) {
    response.success("Hello world!");
});

//To View All Users
Parse.Cloud.define("viewAllUsers", function(request, response) {
    var query = new Parse.Query('User')
    query.find({
        success: function(users) {
            i = users.length
            l = i
            message = ''
            while (i--) {
                message += 'User: ' + users[i].get('username') + '\n'
                message += 'Cash: ' + users[i].get('cash') + '\n'
            }
            response.success(message)
        }
    })
})

//To view specific user by name
Parse.Cloud.define('viewUser', function(request, response) {
    var query = new Parse.Query('User')
    query.equalTo('username', request.params.user)
    query.find({
        success: function(users) {
            if (users.length > 1) {
                response.error('Error! Multiple Users Found!');
                return
            }
            message = {}
            message.user = users[0].get('username')
            message.cash = users[0].get('cash')
            message.id = users[0].get('objectId')
            response.success(message)

        },
        error: function() {
            response.error('User Lookup Failed!')
        }
    })
})

//To modify user cash 
Parse.Cloud.define('modifyUserCash', function(request, response) {
    /*
	if(!request.user){
		response.error('Must be signed in to call this Cloud Function.')
		return
	}
	
	if (!authorized){
		response.error('Not an Admin.')
		return
	}
	*/
    Parse.Cloud.useMasterKey()
    var query = new Parse.Query(Parse.User)
    query.equalTo('username', request.params.user)
    message = '|---Original Value---|\n'
    query.first({
        success: function(user) {
            message = message + 'User: ' + user.get('username') + '\n'
            message = message + 'Cash: ' + user.get('cash') + '\n'
            current = user.get('cash')
            current += request.params.value
            user.set('cash', current)
            user.save(null, {
                success: function(user) {
                    message += '|---Current Value---|\n'
                    message = message + 'User: ' + user.get('username') + '\n'
                    message = message + 'Cash: ' + user.get('cash') + '\n'
                    message = 'Successfully Saved!\n' + message
                    response.success(message)
                },
                error: function(user, error) {
                    response.error('Failed to Save!')
                }
            })
        }
    })
})
//To modify user 
Parse.Cloud.define('modifyUser', function(request, response) {
    Parse.Cloud.useMasterKey()
    var query = new Parse.Query(Parse.User)
    query.equalTo('username', request.params.username)
    query.first({
        success: function(user) {
            for (var key in request.params) {
                user.set(key, request.params[key])
            }
            console.log('Sending...');
            user.save(null, {
                success: function(user) {
                    response.success('User Modification Complete!');
                },
                error: function(err) {
                    console.log('User Modification Failed!');
                    response.error(err.message)
                }
            })
        },
        error: function(err) {
            console.log('User Look-up Failed!');
            response.error(err.message)
        }
    })
})

//To add a task
Parse.Cloud.define('addNote', function(request, response) {
    var NoteClass = Parse.Object.extend('Note')
    var note = new NoteClass()
    for (var key in request.params) {
        note.set(key, request.params[key])
    }
    console.log('Sending...');
    note.save(null, {
        success: function(note) {
            response.success('Sussessfully Sent!')
        },
        error: function(note, err) {
            response.error(err.message)
        }
    })
})

//To modify a note
Parse.Cloud.define('modifyNote', function(request, response) {
    var query = new Parse.Query('Note')
    query.equalTo('title', request.params.title)
    query.first({
        success: function(note) {
            note.set('helpername', request.params.helpername)
            note.set('status', request.params.status)
            note.save(null, {
                success: function(note) {
                    response.success('Note Updated!')
                },
                error: function(err) {
                    console.log('Failed to Update Note!');
                    response.error(err.message)
                }
            })
        },
        error: function(err) {
            console.log('Note Not Found!');
            response.error(err.message)
        }
    })
})

//After post a task with reward, the Person A cash will be deducted by the amount
//of reward, and the reward goes to the Escrow account.
Parse.Cloud.define('userAToEscrow', function(request, response) {
    console.log('Escrow Process Starts!');
    console.log(request);
    Parse.Cloud.useMasterKey()
    var userA = new Parse.Query(Parse.User)
    var escrow = new Parse.Query(Parse.User)
    userA.equalTo('username', request.params.username)
    userA.first({
        success: function(user) {
            console.log(user);
            current = user.get('cash')
            current -= request.params.reward
            user.set('cash', current)
            user.save(null, {
                success: function(user) {
                    escrow.equalTo('username', 'escrow')
                    escrow.first({
                        success: function(escrowAccount) {
                            current = escrowAccount.get('cash')
                            current += request.params.reward
                            escrowAccount.set('cash', current)
                            escrowAccount.save(null, {
                                success: function(escrowAccount) {
                                    response.success('Escrow Session Succeeded!')
                                },
                                error: function(escrowAccount, err) {
                                    console.log('Value Adding to Escrow Failed')
                                    response.error(err.message)
                                }
                            })
                        },
                        error: function(err) {
                            console.log('Error Loading Escrow Account!')
                            response.error(err.message)
                        }
                    })
                },
                error: function(user, err) {
                    console.log('Value Deduction from User A Failed!')
                    response.error(err.message)
                }
            })
        },
        error: function(err) {
            console.log('User A Not Found!')
            response.error(err.message)
        }
    })
})

//After Finishing the task, the reward will be granted
Parse.Cloud.define('escrowToUserB', function(request, response) {
    console.log('Granting Process Starts!');
    Parse.Cloud.useMasterKey()
    var query = new Parse.Query(Parse.User),
        reward = request.params.reward,
        shareToUser = Math.random() * (reward.toFixed(2))
    shareToUser = parseFloat(shareToUser.toFixed(2))
    var shareToCharity = reward - shareToUser
    query.equalTo('username', 'escrow')
    query.first({
        success: function(escrow) {
            escrow.set('cash', escrow.get('cash') - reward)
            escrow.save(null, {
                success: function(escrow) {
                    query.equalTo('username', request.params.helpername)
                    query.first({
                        success: function(user) {
                            user.set('cash', user.get('cash') + shareToUser)
                            user.save(null, {
                                success: function(user) {
                                    console.log('User B Got: $' + shareToUser + ' !');
                                    query.equalTo('username', 'charity')
                                    query.first({
                                        success: function(charity) {
                                            charity.set('cash', charity.get('cash') + shareToCharity)
                                            charity.save(null, {
                                                success: function(charity) {
                                                    console.log('Donated to Charity: $' + shareToCharity + ' !')
                                                    response.success('Granting Session Successed!')
                                                },
                                                error: function(err) {
                                                    console.log('Value Adding to Charity Failed!')
                                                    response.error(err.message)
                                                }
                                            })
                                        },
                                        error: function(err) {
                                            console.log('Error Loading Escrow Account!')
                                            response.error(err.message)
                                        }
                                    })
                                },
                                error: function(err) {
                                    console.log('Value Adding to User B Failed!')
                                    response.error(err.message)
                                }
                            })
                        },
                        error: function(err) {
                            console.log('User A Not Found!')
                            response.error(err.message)
                        }
                    })
                },
                error: function(err) {
                    console.log('Value Deduction from Escrow Failed!')
                    response.error(err.message)
                }
            })
        },
        error: function(err) {
            console.log('Error Loading Escrow Account!')
            response.error(err.message)
        }
    })

})

//Add a user to Installation
Parse.Cloud.define('addUserToInstallation', function(request, response) {
    Parse.Cloud.useMasterKey()
    var query = new Parse.Query(Parse.User),
        install = new Parse.Query(Parse.Installation)
    query.equalTo('username', request.params.username)
    query.first({
        success: function(user) {
            install.equalTo('deviceToken', request.params.deviceToken)
            install.first({
                success: function(installation) {
                    installation.set('user', user)
                    installation.save(null, {
                        success: function(installation) {
                            response.success('Add User To Installation Successful!')
                        },
                        error: function(err) {
                            console.log('Add User To Installation Failed!');
                            response.error(err.message)
                        }
                    })
                },
                error: function(err) {
                    console.log('Installation Look-up Failed');
                    response.error(err.message)
                }
            })
        },
        error: function(err) {
            console.log('User Look-up Failed');
            response.error(err.message)
        }
    })
})

//After a new task is posted by User A, send notification to other nearby users
Parse.Cloud.define('pushNewPost', function(request, response) {
    var point = request.params.location
    var userQuery = new Parse.Query(Parse.User)
    userQuery.near('location', point)
    userQuery.limit(20)
    userQuery.notEqualTo('username', request.params.username)
    var pushQuery = new Parse.Query(Parse.Installation)
    pushQuery.matchesQuery('user', userQuery)
    data = {}
    data.alert = 'User: ' + request.params.username + ' Content: ' + request.params.content + ' Reward : $' + request.params.reward.toString()
    Parse.Push.send({
        where: pushQuery,
        data: data
    }, {
        success: function() {
            response.success('Push New Post Succeeded!');
        },
        error: function() {
            response.error('Push New Post Failed');
        }
    })
})

//After a task is accepted by User B, send notifcation to User A
Parse.Cloud.define('pushAcceptance', function(request, response) {
    var userQuery = new Parse.Query(Parse.User)
    userQuery.equalTo('username', request.params.username)
    var pushQuery = new Parse.Query(Parse.Installation)
    pushQuery.matchesQuery('user', userQuery)
    data = {}
    data.alert = request.params.helpername + '\'s gonna help you!'
    Parse.Push.send({
        where: pushQuery,
        data: data
    }, {
        success: function() {
            response.success('Push Acceptance Succeeded!');
        },
        error: function() {
            response.error('Push Acceptance Failed!')
        }
    })
})

//After a task is completed by User B, send notification to both User A and User B
Parse.Cloud.define('pushCompletion', function(request, response) {
    var userAQuery = new Parse.Query(Parse.User)
    userAQuery.equalTo('username', request.params.username)
    var userBQuery = new Parse.Query(Parse.User)
    userBQuery.equalTo('username', request.params.helpername)
    var userQuery = Parse.Query.or(userAQuery, userBQuery)
    var pushQuery = new Parse.Query(Parse.Installation)
    pushQuery.matchesQuery('user', userQuery)

    data = {}
    data.alert = 'Task Completed!'
    Parse.Push.send({
        where: pushQuery,
        data: data
    }, {
        success: function() {
            response.success('Push Completion Succeeded!');
        },
        error: function() {
            response.error('Push Completion Failed!')
        }
    })

})

Parse.Cloud.define('completion', function(request, response) {
    console.log('Granting Process Starts!');
    //For push notification
    var userAQuery = new Parse.Query(Parse.User)
    userAQuery.equalTo('username', request.params.username)
    var userBQuery = new Parse.Query(Parse.User)
    userBQuery.equalTo('username', request.params.helpername)
    var userQuery = Parse.Query.or(userAQuery, userBQuery)
    var pushQuery = new Parse.Query(Parse.Installation)
    pushQuery.matchesQuery('user', userQuery)

    data = {}
    data.alert = 'Task Completed!'
    //For granting
    Parse.Cloud.useMasterKey()
    var query = new Parse.Query(Parse.User),
        reward = request.params.reward,
        shareToUser = Math.random() * (reward.toFixed(2))
    shareToUser = parseFloat(shareToUser.toFixed(2))
    var shareToCharity = reward - shareToUser
    query.equalTo('username', 'escrow')
    query.first({
        success: function(escrow) {
            escrow.set('cash', escrow.get('cash') - reward)
            escrow.save(null, {
                success: function(escrow) {
                    query.equalTo('username', request.params.helpername)
                    query.first({
                        success: function(user) {
                            user.set('cash', user.get('cash') + shareToUser)
                            user.save(null, {
                                success: function(user) {
                                    console.log('User B Got: $' + shareToUser + ' !');
                                    query.equalTo('username', 'charity')
                                    query.first({
                                        success: function(charity) {
                                            charity.set('cash', charity.get('cash') + shareToCharity)
                                            charity.save(null, {
                                                success: function(charity) {
                                                    console.log('Donated to Charity: $' + shareToCharity + ' !')
                                                    data.alert = data.alert + ' $' + shareToCharity + ' donated and $' + shareToUser + 'earned!'
                                                    Parse.Push.send({
                                                        where: pushQuery,
                                                        data: data
                                                    }, {
                                                        success: function() {
                                                            response.success('Push Acceptance Succeeded!');
                                                        },
                                                        error: function() {
                                                            response.error('Push Acceptance Failed!')
                                                        }
                                                    })
                                                },
                                                error: function(err) {
                                                    console.log('Value Adding to Charity Failed!')
                                                    response.error(err.message)
                                                }
                                            })
                                        },
                                        error: function(err) {
                                            console.log('Error Loading Escrow Account!')
                                            response.error(err.message)
                                        }
                                    })
                                },
                                error: function(err) {
                                    console.log('Value Adding to User B Failed!')
                                    response.error(err.message)
                                }
                            })
                        },
                        error: function(err) {
                            console.log('User A Not Found!')
                            response.error(err.message)
                        }
                    })
                },
                error: function(err) {
                    console.log('Value Deduction from Escrow Failed!')
                    response.error(err.message)
                }
            })
        },
        error: function(err) {
            console.log('Error Loading Escrow Account!')
            response.error(err.message)
        }
    })

})

Parse.Cloud.afterSave('Note', function(request, response) {
    //userAToEscrow(request.object)
    note = request.object
    if (note.get('status') == 'sent') {
        console.log('New Post Received!');
        Parse.Cloud.run('userAToEscrow', {
            username: note.get('username'),
            reward: note.get('reward')
        }, {
            success: function(users) {},
            error: function(error) {}
        })
        Parse.Cloud.run('pushNewPost', {
            username: note.get('username'),
            content: note.get('content'),
            reward: note.get('reward'),
            location: note.get('location')
        }, {
            success: function(users) {},
            error: function(error) {}
        })
    } else if (note.get('status') == 'accepted') {
        console.log('Task Accepted!');
        Parse.Cloud.run('pushAcceptance', {
            username: note.get('username'),
            helpername: note.get('helpername')
        })
    } else if (note.get('status') == 'completed') {
        console.log('Task Completed');
        /*
        Parse.Cloud.run('escrowToUserB', {
            helpername: note.get('helpername'),
            reward: note.get('reward')
        }, {
            success: function(users) {},
            error: function(error) {}
        })
        Parse.Cloud.run('pushCompletion', {
            username: note.get('username'),
            helpername: note.get('helpername')
        })
*/
        Parse.Cloud.run('completion', {
            username: note.get('username'),
            helpername: note.get('helpername'),
            reward: note.get('reward')
        })
    }

})