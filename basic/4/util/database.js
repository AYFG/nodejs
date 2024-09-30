require("dotenv").config();
const password = process.env.DATABASE_PASSWORD;

// Sequelize 적용 전
// const mysql = require("mysql2");
// const pool = mysql.createPool({
//   host: "localhost",
//   user: "root",
//   database: "node-complete",
//   password: password,
// });
// module.exports = pool.promise();

const Sequelize = require("sequelize");
// db이름, user명, 비밀번호, 옵션
const sequelize = new Sequelize("node-complete", "root", password, {
  dialect: "mysql",
  host: "localhost",
});

module.exports = sequelize;
