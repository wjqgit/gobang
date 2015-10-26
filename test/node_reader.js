var rl = require('readline').createInterface({
  input: require('fs').createReadStream('rails-3_layers.txt')
});

rl.on('line', function (line) {
  console.log('\'' + line + '\'' + ': ' + '\'' +  line + '\',' );
})
