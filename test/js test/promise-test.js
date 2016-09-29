'use strict'

const fs = require('fs');

const onsuccess = (text) => {return text.toUpperCase()};
const onfail = console.log;

const onsuccess2 = console.log;

const text = new Promise(function (resolve, reject) {
  fs.readFile('text.txt', function(err, text) {
    if (err) reject (err);

    else resolve(text.toString());

  })
});

const capital = text.then(onsuccess, onfail);

capital.then(onsuccess2, onfail);

console.log(onsuccess);
