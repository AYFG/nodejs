const mysql = require("mysql2");
const poolPassword = process.env.poolPassword;

const pool = mysql.createPool({
  host: "localhost",
  user: "root",
  database: "node-complete",
  password: poolPassword,
});

module.exports = pool.promise();
