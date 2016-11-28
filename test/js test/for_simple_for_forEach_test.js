var arr = [];
for (let i = 0; i < 10000; i++) arr[i] = i;

var numOfTest = 100;

function runTest(name, func) {
    console.time(name);

    for (let i = 0; i < numOfTest; i++) func();

    console.timeEnd(name);
}

function testFunc(v) {
    return v + 1;
}

runTest('for', () => {
    for (let i = 0; i < arr.length; i++) testFunc(arr[i]);
})

runTest('simpleFor', () => {
    for (let i in arr) testFunc(arr[i]);
})

runTest('forEach', () => {
    arr.forEach((val) => testFunc(val));
})
