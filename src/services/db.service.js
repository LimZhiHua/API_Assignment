const mysql = require('mysql2');
const util = require('util');
const Sequlize = require('sequelize')
const dbConfig = require('../configs/db.config');

const sequelize = new Sequlize(dbConfig.database, "root", "password",{
    dialect: "mysql",
    host: dbConfig.host,
    port: dbConfig.port,
})

// var conn = mysql.createConnection({
//     host: dbConfig.host,
//     user: dbConfig.user,
//     password: dbConfig.password,
//     database: dbConfig.database,
//     insecureAuth : true
//   });

// const query = util.promisify(conn.query).bind(conn);

module.exports =  sequelize
