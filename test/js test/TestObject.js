TestObject = function(y) {
  Object.call(this);

  this.y = y;
}

TestObject.prototype = Object.create(Object.prototype);
TestObject.prototype.constructor = TestObject;

TestObject.prototype.change = function(y) {
  this.y = y;
}
