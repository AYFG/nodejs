const mongodb = require("mongodb");
const { ObjectId } = mongodb;
const getDb = require("../util/database").getDb;

class Product {
  constructor(title, price, imageUrl, description, id, userId) {
    this.title = title;
    this.price = price;
    this.imageUrl = imageUrl;
    this.description = description;
    this._id = id ? ObjectId.createFromHexString(id) : null;
    this.userId = userId;
  }

  save() {
    const db = getDb();
    let dbOp;
    if (this._id) {
      // Update the product
      dbOp = db.collection("products").updateOne({ _id: this._id }, { $set: this });
    } else {
      dbOp = db.collection("products").insertOne(this);
    }
    return dbOp
      .then((result) => {
        console.log(result);
      })
      .catch((err) => {
        console.error(err);
      });
  }

  static fetchAll() {
    const db = getDb();
    return db
      .collection("products")
      .find()
      .toArray()
      .then((products) => {
        console.log(products);
        return products;
      })
      .catch((err) => {
        console.error(err);
      });
  }

  static findById(prodId) {
    const db = getDb();

    return (
      db
        .collection("products")
        // .find({ _id: new mongodb.ObjectId(prodId) })
        .find({ _id: ObjectId.createFromHexString(prodId) })
        .next()
        .then((product) => {
          console.log(product);
          return product;
        })
        .catch((err) => {
          console.error(err);
        })
    );
  }

  static deleteById(prodId) {
    const db = getDb();
    return db
      .collection("products")
      .deleteOne({ _id: ObjectId.createFromHexString(prodId) })
      .then((result) => {
        console.log("제품 삭제 성공");
      })
      .catch((err) => console.error(err));
  }
}

module.exports = Product;
