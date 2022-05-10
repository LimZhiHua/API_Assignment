const Sequlize = require("sequelize");
const dbConfig = require("../configs/db.config");

const sequelize = new Sequlize(dbConfig.database, "root", "password", {
  dialect: "mysql",
  host: dbConfig.host,
  port: dbConfig.port,
});

module.exports = sequelize;
