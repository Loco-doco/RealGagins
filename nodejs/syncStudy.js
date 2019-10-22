const fs = require('fs');

console.log("A");
fs.readFile('nodejs/sample.txt','utf8', (err, data) => {
    console.log(data)
})

console.log("C");
console.log("C");
console.log("C");
console.log("C");