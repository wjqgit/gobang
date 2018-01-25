module.exports = transmitter;

function transmitter(options, done) {
    var options = options || {};

    const codes = options.codes || {},
        message = options.message || 'default message',
        toggle = options.toggle,
        timeouter = options.timeouter;

    let pointer = 0;
    const events = [];

    for (let i = 0; i < message.length; i++) {
        let c = message[i];

        if (c == ' ') continue;
        else if (codes[c] != null) {
            if (i > 0) {
                if (message[i - 1] == ' ') appendEvent(7)
                else appendEvent(3)
            }
            else appendEvent(0)

            const code = codes[c];

            for (let j = 0; j < code.length; j++) {
                if (j > 0) appendEvent(1)

                const s = code[j];

                if (s == '.') appendEvent(1)
                else if (s == '-') appendEvent(3)
            }

        } else {
            console.error('invalid character')
        }
    }

    function appendEvent(delay) {
        events.push(timeouter(toggle, pointer + delay))

        pointer += delay;
    }

    Promise.all(events).then(result => {
        done();
    })

}


