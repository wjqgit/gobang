//http://blog.parse.com/2012/10/11/the-javascript-sdk-in-node-js/

var Parse = require('parse.js').Parse
var appId = 'B8REOlxs4tSA2DuOF2khBjOO6aB1nIB4x1rlwcnT',
	jsKey = 'lUQYcUT57AXWXTeFr5kTNKFAv5NDpbPbaXxWQA01',
	mKey = 'mTDsPexarHQGeMJ3YAfBMYMQNAmKIkuTlY6Hwuf3'

Parse.initialize(appId, jsKey, mKey)

Parse.Cloud.run('test', {}, {
  success: function(result) {
    // result is 'Hello world!'
  },
  error: function(error) {
  }
});