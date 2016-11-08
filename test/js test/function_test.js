function Func0(name) {
  this.name = name;
    console.log(`${this.name} constructor`);
}

Func0.prototype.log = function() {console.log(`${this.name} log`);}

var Fun1;

if (true) {
  Func1 = Func0;
}

var func1 = new Func1('func1');

func1.log();
