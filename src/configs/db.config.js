require("dotenv").config();
const env = process.env;
const db = {
  host: env.DB_HOST,
  user: env.DB_USER,
  password: env.DB_PASSWORD,
  database: env.DB_NAME || "api_assignment",
  port: env.DB_PORT || 3306,
  insecureAuth: true,
};

module.exports = db;
