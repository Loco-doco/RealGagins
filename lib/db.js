const mysql = require('mysql');
const db = mysql.createConnection({
    host : 'localhost',
    user : 'root',
    password : '123123',
    database : 'nodeTest'
});
db.connect();

module.exports = db;