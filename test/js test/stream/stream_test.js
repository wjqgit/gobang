/**
 *  https://github.com/substack/stream-handbook
 * 
 */

const Readable = require('stream').Readable
const Writable = require('stream').Writable
const fs = require('fs')

// const rs = new Readable

// let c = 97

// rs._read = () => {
//     rs.push(String.fromCharCode(c++))
//     if ( c > 'z'.charCodeAt(0)) rs.push(null)
// }

// rs.pipe(process.stdout)

// process.stdin.on('readable', () => {
//     var buf = process.stdin.read()

//     console.dir(buf)
// })

const inputName = 'test.log'
const outputName = 'out.log'

fs.lstat(inputName, (err, states) => {
    if (err) throw err

    if (states.isFile()) {
        console.log(`${inputName} is a file`)

        const rs = fs.createReadStream(inputName)

        rs.on('error', err => { if (err) throw err }) 

        rs.on('readable', () => {
            let buf = rs.read();

            if (!buf) return 

            for (let i = 0; i < buf.length; i++) {
                if (buf[i] === 0x0a) {
                    console.dir(buf.slice(0, i).toString())
                    buf = buf.slice(i + 1)
                    rs.unshift(buf)
                    return
                }
            }

            rs.unshift(buf)
        })
    }
} )