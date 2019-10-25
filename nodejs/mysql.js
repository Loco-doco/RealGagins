const mysql = require('mysql');
const connection = mysql.createConnection({
    host : "sming-official-db-readonly.ct4r9y9daqyh.us-west-1.rds.amazonaws.com",
    port : 3306,
    database : "sming_stream",
    user : "admin",
    password : "sming1234"
});

connection.connect(
    (err) => {
        if(err) throw err;
        console.log("Success");
    }
);

connection.query(
    `SELECT COUNT(DISTINCT streamer_gid) AS DAS, DATE_FORMAT(start_time, "%Y-%m-%d") AS start_time
    FROM sming_stream.tb_live_history
    GROUP BY DATE_FORMAT(start_time, "%Y-%m-%d")
    ORDER By start_time DESC
    ;`,
    (error, result, fields) => {
        if(error){
            console.log(error);
        }
        console.log(result);
    }
)
connection.end();