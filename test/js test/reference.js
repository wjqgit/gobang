function test1(obj) {
	test2(obj)
	
	console.log(`test1: ${obj.name}`)
	
}

function test2(obj) {
	obj.name = 'wjq'
	//obj = {name:'wjq'}
	
	console.log(`test2: ${obj.name}`)
}

test1({name: 'mia'})