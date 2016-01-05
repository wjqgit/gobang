var readline = require('readline');

var rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
})

var answer;
var point;

// rl.question("test", function(ans) {
//     answer = ans;
//     console.log(answer);
//     rl.close();
// } )

rl.setPrompt('tester>')
rl.prompt();

rl.on('line', function(line) {
  switch(line.trim()) {
    case 'point':
    console.log("creating a point");
    createPoint();
    break;
    default:
    console.log('sorry...');
    break;
  }
}).on('close', function() {
  console.log('byebye');
  process.close(0);
})

function createPoint() {
  rl.setPrompt('point>')
  rl.question('please input a point: ', function(ans) {
    point = ans;
    console.log(point);
    rl.question('please input another point: ', function(ans) {
      console.log(point == ans);
    })
  })
}
