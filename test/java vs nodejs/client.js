const http = require('http')

const host = process.argv[2] || "localhost"
const port = process.argv[3] || 80
const url = `http://${host}:${port}`
const steps = process.argv[4] || 100

let timer = 0
let counter = 0;

for (let i = 0; i < steps; i++) {
  setTimeout(() => sendRequest(), 0)
}

const sendRequest = () => {
  const startTime = Date.now()

  http.get(url, (res) => {
    let data = ""
    res.on('data', (chunk) => data += chunk)
    res.on('end', () => {
      const endTime = Date.now()
      const timeSpent = endTime - startTime

      timer += timeSpent
      counter++

      // console.log(startTime);
      // console.log(endTime);

      if (counter == steps) {
        const averageTime = timer / steps;
        console.log(`Average Time: ${averageTime} (ms)`);
      }
    })
  }).on('error', err => console.log(`Error: ${err.message}`) )
}
