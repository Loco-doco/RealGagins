const mysql = require('mysql');
const connection = mysql.createConnection({
    host : 'localhost',
    user : 'root',
    password : '123123'
    // database : 'nodeTest'
});

connection.connect(
    (err) => {
        if(err) throw err;
        console.log("Success");
    }
);

connection.query(
    'SELECT * FROM mysql.user;',
    (error, result, fields) => {
        if(error){
            console.log(error);
        }
        console.log(result);
    }
)
connection.end();