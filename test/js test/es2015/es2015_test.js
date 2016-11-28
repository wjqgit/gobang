/*
*
* DESTRUCTURING
*
*/

const fuzz = "fuzz";

const obj = {
  foo: 1,
  bar: 2,
  baz: 3,
  ["name" + fuzz]: 4,
}


// const obj2 = Object.assign({}, obj, {foo: 2})
// const obj2 = {...obj}

// console.log(obj);
// console.log(obj2.foo);

const arr = [1, 2, 3]
const [ one ] = arr

// console.log(one);

const length = 7;
const width = 13;
const callback = () => {
  console.log('ahhh');
}

function calculate({ length, width, height=10, callback }) {
// function calculate(metrics) {
  // const { length, width } = metrics
  callback();
  return length * width * height
}

// console.log(calculate({ length, width, callback }));
// console.log(calculate({ length, width, callback: () => {console.log('ha');} }));


/*
*
* TEMPLATE STRING
*
*/

// console.log(`arr: ${arr}, length: ${length}`);
// console.log(`arr: ${arr},
//   length: ${length}`); // multiple lines

/*
*
* BLOCK SCOPING
* var is function scoped
* let is new var, but block scoped
* const is also block scoped
*
*/

(function func() {
  var a = 2;
})()

// console.log(a); // a is not defined

if (true) {
  // var a = 713;
  // let a = 713;
  const a = 713;
}

// console.log(a);

/*
*
* CONSTANT
*
*/

const a = 1;
// a = 2; // not allowed
// console.log(a);

const b = { a: 1 };
b.a = 2; // allowed
// b = {}; // not allowed
// console.log(b);


/*
*
* CLASS
*
*/

class Parent {
  // age = 713; // static variable ES7

  constructor() {

  }

  foo() {
      console.log('haha');
      // console.log(this); // Parent
  }

  static bar() {
    console.log('ahh');
  }
}

var parent = new Parent
// parent.foo()
// console.log(parent.age);
// Parent.bar()

class Child extends Parent {
  constructor() {
    super()
  }

  baz() {
    console.log('mia');
  }
}

var child = new Child
// child.foo()
// Child.bar();
// child.baz()

/*
*
* ARROW FUNCTION
* especially useful as argument
*
*/
var foo = function(a, b) {
  return a + b
}

var foo = (a, b) =>  {
  return a + b
}

// do.sth((a, b) => {return a + b});

// implicit return
// do.sth((a, b) => a + b);
// do.sth(a => a++);
const arr2 = arr.map(val => ++val)
// console.log(arr2);


// automatically bind 'this'
var module = {
  age: 7,
  foo: function() {
    console.log(this.age);
  },
  bar: function() {
    // setTimeout(function() {
    //   console.log(this.age);
    // }.bind(this), 100)
    setTimeout(() => console.log(this.age), 100)
  }
}

// module.foo();
// module.bar();

// watch out the binding when use jquery

// $("some-thing").with().jQuery(() => {
//   $(this) // become the context where jQuery function is defined instead of the jquery event/dom handler/binder/listener
// })

/*
*
* MODULES
*
*/

// export default function() {
//     do sth
// }

// export function foo() {
  // do sth foo
// }

// export const bar = 7


// import testModule from './testModule'
// import { foo, bar } from './testModule'
// import { foo, bar as bla } from './testModule'
// import * as testModule from './testModule'
// testModule.foo();


/*
*
* GENERATOR FUNCTION
* pausible/iterable function
*
*/

var myGen = function*() {
  var one = yield 1;
  var two = yield 2;
  var three = yield 3;
  console.log(one, two, three);
}

var gen = myGen()

// console.log(gen.next(0));
// console.log(gen.next(1));
// console.log(gen.next(2));
// console.log(gen.next(3));
// console.log(gen.next(4));
// console.log(gen.next(5));

function smartWrapper(generator) {
  let gen = generator();

  let yieldVal = gen.next();

  if (yieldVal.then) {
    yieldVal.then(gen.next) // pass the next function as callback, which will accept the return value of promise and execute next async function for the next yield
  }
}

// libraries provides this: bluebird, co, q

// e.g. Bluebird
// Promise.coroutine(function* () {
//   var tweets = yield $.get('tweet.json')
//   var profile = yield $.get('profile.json')
//   var friends = yield $.get('friends.json')
//
//   console.log(tweets, profile, friends);
// })
Promise.coroutine(function* () {
  let data = {
    tweets: $.get('tweets.json'),
    profile: $.get('profile.json'),
  } // will run simultaneously
  console.log(data.tweets, data.profile);
})

Promise.coroutine(function* () {
  let [ tweets, profile ] = yield [
    $.get('tweets.json'),
    $.get('profile.json')
  ]
  console.log(tweets, profile);
})


// async function () {
//   var friends = await $.get("http://somesite.com/friends")
//   console.log(friends);
// }
