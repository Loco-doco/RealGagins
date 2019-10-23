const mysql = require('mysql');
const connection = mysql.createConnection({
    host : 'localhost',
    user : 'root',
    pasword : '12345',
    database : 'nodeTest'
});

connection.connect(
    (err) => {
        if(err) throw err;
        console.log("Success");
    }
);

// connection.query(
//     'SELECT * FROM topic;',
//     (error, result, fields) => {
//         if(error){
//             console.log(error);
//         }
//         console.log(result);
//     }
// )
connection.end();