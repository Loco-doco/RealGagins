var fs = require('fs');

fs.readFile('nodejs/sample.txt', 'utf8',(errss,data) => {
    console.log(data);
});

