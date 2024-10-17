const { DOUBLE } = require("sequelize");

const getDb = require("../util/database").getDb;

class Product {
  constructor(title, price, imageUrl, description) {
    this.title = title;
    this.price = price;
    this.imageUrl = imageUrl;
    this.description = description;
  }

  save() {
    const db = getDb;
    // db.collection("products").insertOne({ name: "A Book", price: 12.99 });
    db.collection("products")
      .insertOne(this)
      .then((result) => {
        console.log(result);
      })
      .catch((err) => {
        console.error(err);
      });
  }
}

module.exports = Product;
