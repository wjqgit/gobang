function testObj(name) {
  this.name = name;
}

function testObj2(obj) {
  this.obj = obj
}

var objArr = [new testObj('aaa'), new testObj('bbb'), new testObj('ccc')]

var obj2 = new testObj2(objArr[0]);

console.log(obj2);

objArr.splice(0, 1);

console.log(obj2);
