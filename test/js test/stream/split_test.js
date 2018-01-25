const stream = require('stream')
const fs = require('fs')
const split = require('split')

const Readable = stream.Readable
const Writable = stream.Writable

// const inputName = 'test.log'
const inputName = 'movement_log.log'

fs.lstat(inputName, (err, states) => {
    if (err) throw err

    if (states.isFile()) {

        console.log(`${inputName} is a file`)

        let animation = []

        const rs = fs.createReadStream(inputName)
            .pipe(split())

        rs.on('data', line => {
            animation.push(line)

            if (animation.length >= 1000) {
                rs.pause()
                console.log('readable stream paused.')
                console.log(`${animation.length}`)
                console.log(`animation length is now ${animation.length}`)
                // rs.destroy()
            }

        })


        setInterval(() => {
            const len = animation.length
            console.log(len)

            if (len >= 100) {
                animation = animation.slice(0, len - 100);
            }
            
            if (rs && rs.paused && animation.length < 100) {
                rs.resume()
                console.log('readable stream resumed.')
            }

        }, 10)


    }
})