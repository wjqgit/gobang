var interval = 1000/60;

var timer = function() {
  postMessage(interval);

  setTimeout(timer, interval)
}

setTimeout(timer, interval);
