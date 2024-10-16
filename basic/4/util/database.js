require("dotenv").config();
const mongodb = require("mongodb");
const mongoClient = mongodb.MongoClient;
const password = process.env.DATABASE_PASSWORD;

const mongoConnect = (callback) => {
  mongoClient
    .connect(
      `mongodb+srv://sek82468246:${password}@cluster0.xupmv.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`,
    )
    .then((client) => {
      console.log("몽골디비 연결 성공~");
      callback(client);
    })
    .catch((err) => console.error(err));
};

module.exports = mongoConnect;
