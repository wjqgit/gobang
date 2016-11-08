var http = require('http');

var str = '';
// http.get('http://labserver:8080/graphics_web/public/json/demo1f.json', (res) => {
http.get('http://rest.learncode.academy/api/johnbob/friends', (res) => {
  // output to stdout
  // res.pipe(process.stdout);
  // res.on('end', () => {
  //   console.log('finished');
  // })

  // not working
  // process.stdout.write(res);

  // convert to string
  res.on('data', chunk => str += chunk);
  res.on('end', () => console.log(str));

  // not working
  // if (err) console.error(err);
  // str = data.toString();
} );
