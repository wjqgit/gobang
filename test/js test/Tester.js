Tester = function(x) {
  Object.call(this);

  this.test = x;
}

Tester.prototype = Object.create(Object.prototype);
Tester.prototype.constructor = Tester;

Tester.prototype.change = function(x) {
  this.test.change(x);
}

Tester.prototype.testFunc1  = function() {
  return this.testFunc2(this.test)
}

Tester.prototype.testFunc2 = function(x) {
  return ++x;
}

Tester.prototype.log = function() {
  console.log(this.test);
}
