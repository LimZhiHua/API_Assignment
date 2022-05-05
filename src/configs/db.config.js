// store the db info here

// this part is copied from online
require('dotenv').config()
const env = process.env;
const db = {
    host: env.DB_HOST,
    user: env.DB_USER,
    password: env.DB_PASSWORD,
    database: env.DB_NAME || 'api_assignment',
    port: env.DB_PORT || 3306,
        insecureAuth : true
   
};

module.exports = db;

// Change these parameters when you get an actual DB instead of the local one.
// var conn = mysql.createConnection({
//     host: "localhost",
//     user: "root",
//     password: "password",
//     database: "new_schema",
//     insecureAuth : true
//   });

//   module.exports = conn;