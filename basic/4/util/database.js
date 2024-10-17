require("dotenv").config();
const mongodb = require("mongodb");
const mongoClient = mongodb.MongoClient;
const password = process.env.DATABASE_PASSWORD;
let _db;

const mongoConnect = (callback) => {
  mongoClient
    .connect(
      `mongodb+srv://sek82468246:${password}@cluster0.xupmv.mongodb.net/shop?retryWrites=true&w=majority&appName=Cluster0`,
    )
    .then((client) => {
      console.log("몽골디비 연결 성공~");
      _db = client.db();
      callback(client);
    })
    .catch((err) => {
      console.error(err);
      throw err;
    });
};

const getDb = () => {
  if (_db) {
    return _db;
  }
  throw "db를 찾지못했습니다.";
};

exports.mongoConnect = mongoConnect;
exports.getDb = getDb;
