const mongodb = require("mongodb");
const getDb = require("../util/database").getDb;

const { ObjectId } = require("mongodb");
class User {
  constructor(username, email) {
    this.name = username;
    this.email = email;
  }
  save() {
    const db = getDb();
    db.collection("users")
      .insertOne(this)
      .then()
      .catch((err) => console.error(err));
  }

  static findById(userId) {
    const db = getDb();
    return db
      .collection("users")
      .findOne({ _id: ObjectId.createFromHexString(userId) })
      .then((user) => {
        console.log(user);
        return user;
      })
      .catch((err) => {
        console.error(err);
      });
  }
}
module.exports = User;
