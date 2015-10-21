var rl = require('readline').createInterface({
  input: require('fs').createReadStream('rails.txt')
});

rl.on('line', function (line) {
  console.log('\'' + line + '\'' + ': ' + '\'' +  line + '\',' );
})
