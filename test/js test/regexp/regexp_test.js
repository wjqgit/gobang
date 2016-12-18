const str = "pen pineapple apple pen"
const c_str = "Pen Pineapple Apple Pen"
const re_str = "pinaaaapple"
const ml_str = "pen pineapple\napple pen"
var u_str = 'Образец text на русском языке'

/*
* ===== CREATE REGEXP =====
*/
// const re = /a/i
// const re = new RegExp('a', 'i')
// const re = new RegExp(/a/, 'iy')
// re.lastIndex = 8
// const match = re.exec(str)
// console.log(match);

/*
* ===== FLAGS =====
*/
// const re = /a/g
// console.log(re.exec(str));

// const re = /p/i
// console.log(re.exec(c_str));

// const re = /pine[^]*apple/m
// const re0 = /^a/m
// console.log(re.exec(ml_str));
// console.log(re0.exec(ml_str));

// const re = /[\u0400-\u04FF]+/g
// console.log(re.exec(u_str));

// const re = /a/y
// re.lastIndex = 7;
// re.lastIndex = 8;
// console.log(re.exec(str));

/*
* ===== CHARACTERS CLASSES =====
*/
// const re = /.*/
// console.log(re.exec(str));

// const re = /\d/
// console.log(re.exec('ae86'));

// const re = /\D/
// console.log(re.exec('ae86'));

// const re = /\w/
// console.log(re.exec('_hello'));

// const re = /\W/
// console.log(re.exec('#_hello'));

// const re = /\s/
// console.log(re.exec(str));

// const re = /\S/
// console.log(re.exec(str));

// const re = /\t/
// console.log('\ttab');
// console.log(re.exec('\ttab'));

// const re = /\r/ // carriage return
// console.log('first line\rseconde line');
// console.log(re.exec('first line\rseconde line'));

// const re = /\n/ // line feed
// console.log('first line\nseconde line');
// console.log(re.exec('first line\nseconde line'));

// const re = /\v/
// console.log('hello\vworld');
// console.log(re.exec('hello\vworld'));

// const re = /\f/ // form feed
// console.log('hello\fworld');
// console.log(re.exec('hello\fworld'));

// const re = /[\b]/ // backspace

// const re = /\0/ // NUL character

// const re = /\cX/ // control character

// const re = /\x41/ // ascii code
// console.log(re.exec('A'));

// const re = /\u0400/ // unicode

// const re = /\u{0400}/
// const re = /\u{00000}/ // works when u flag is set

// \ // invertion between literal and special chacter
// const re = /\b/ // matches word boundary
// const re = /a\*/ // matches 'a*'


/*
* ===== CHARACTERS SET =====
*/

// const re = /[abc]/
// const re = /[a-c]/
// console.log(re.exec(str));

// const re = /[^a-c]/
// const re = /[^a-c\s]/
// console.log(re.exec(str));

/*
* ===== ALTERNATION =====
*/

// const re = /apple|orange/
// console.log(re.exec(str));

/*
* ===== BOUNDARIES =====
*/

// const re = /^pe/
// console.log(re.exec(str));

// const re = /en$/
// console.log(re.exec(str));

// const re = /\ba.*e\b/
// console.log(re.exec(str));

// const re = /\Bap/
// console.log(re.exec(str));

/*
* ===== GROUPING AND BACK REFERENCES =====
*/

// const re = /\ba(.*)e\b/
// console.log(re.exec(str));

// const re = /(apple)\s\1/
// console.log(re.exec(str));

// const re = /pine(?:apple)/
// console.log(re.exec(str));

/*
* ===== QUANTIFIERS =====
*/

// const re = /ap*/ // 0 or more times
// console.log(re.exec(str));

// const re = /ap+/ // 1 or more times
// console.log(re.exec(str));

// const re = /ap?/ // 0 or 1 time
// console.log(re.exec(str));

// const re = /ap{2}/ // n times
// console.log(re.exec(str));

// const re = /a{2,}/ // n or more times
// console.log(re.exec(re_str));

// const re = /a{2,3}/ // n to m times
// console.log(re.exec(re_str));

// const re = /a+?/ // non-greedy
// console.log(re.exec(re_str));


/*
* ===== ASSERTION =====
*/

// const re = /pine(?=apple)/
// console.log(re.exec(str));

// const re = /pine(?!apple)/
// const re = /pine(?!orange)/
// console.log(re.exec(str));

/*
* ===== PROPERTIES =====
*/

// const re = /(pine)(apple)/
// re.exec(str)
// console.log(RegExp.$1);
// console.log(RegExp.$2);
// console.log(RegExp.$_);

/*
* ===== METHODS =====
*/

const re = /(pine)(apple)/
// console.log(re.exec(str));

// console.log(re.test(str));

// console.log(str.match(re));

// console.log(str.replace(re, '$2$1'));

// console.log(str.search(re));

console.log(str.split(re));
// console.log(str.split(/\s/));
