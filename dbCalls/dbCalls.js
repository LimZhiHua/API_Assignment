
// SQL Portion
var mysql = require('mysql');

var con = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "password",
    insecureAuth : true
  });
  
//   con.connect(function(err) {
//     if (err) throw err;
//     console.log("Connected!");
//   });

const sql = 'SELECT * FROM sys.teachers;'

  con.connect(function(err) {
    if (err) throw err;
    console.log("Connected!");
    con.query(sql, function (err, result) {
      if (err) throw err;
      console.log("Result: " + JSON.stringify(result));
    });
  });

