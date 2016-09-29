function test() {
  for (i in arguments) {
    console.log(arguments[i]);
  }
}

test(1, 2, 3, 4)
