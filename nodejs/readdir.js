const testfolder = './text';
const fs = require('fs');

fs.readdir(testfolder, (err, data)=>{
    console.log(data);
})