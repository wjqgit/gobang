var fps = 60,
    interval = 1000 / fps;

var lastTime;

self.addEventListener('message', function(e) {
    let data = e.data;
    // switch (e.data) {
    switch (data.event) {
        case 'start_timer':
            timer = Date.now();
            // self.postMessage('start_frame');
            self.postMessage({'event': 'start_frame'});
            break;
        case 'end_frame':
            let deltaTime = Date.now() - lastTime;

            let factor = data.deltaTime > interval ? data.deltaTime - interval : 0;
            let delay = deltaTime > interval ? 0 : interval - deltaTime - factor;

            // console.log(`delta time: ${deltaTime}`);
            // console.log(`animator delta time: ${data.deltaTime}`);
            // console.log(`delay: ${delay}`);

            setTimeout(function() {
                lastTime = Date.now();
                // self.postMessage('start_frame');
                self.postMessage({'event': 'start_frame'});
            }, delay);

            break;
        default:
            // console.warn(`Unknown event: ${e.data}`);
            console.warn(`Unknown event: ${data.event}`);
    }
})
