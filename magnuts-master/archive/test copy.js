function Ninja(){}
Ninja.prototype.swingSword = function(){
	return true
}

var ninjaA = Ninja()
console.log(!ninjaA)
assert(!ninjaA, "Error!")