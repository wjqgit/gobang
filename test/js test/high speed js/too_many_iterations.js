function bubbleSort(array, onComplete) {
  var pos = 0;

  (function() {
    var j, value;

    for (j = array.length; j > pos; j--) {
      if (array[j] < array[j-1]) {
        value = data[j];
        data[j] = array[j-1];
        data[j-1] = array[j]
      }
    }

    pos++;

    if (pos < array.length) {
      setTimeout(arguments.callee, 10);
    } else {
      onComplete();
    }
  })();
}

bubbleSort([1,2,3,4,5,6,7])
