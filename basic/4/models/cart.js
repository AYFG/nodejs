const fs = require("fs");
const path = require("path");

const p = path.join(path.dirname(require.main.filename), "data", "cart.json");
module.exports = class Cart {
  static addProduct(id, productPrice) {
    // 이전 카트를 불러낸다
    // 카트가 있는 경우(오류가 발생하지 않은 경우)
    // 새로 상품을 추가하거나 해당 상품의 수량 증가

    fs.readFile(p, (err, fileContent) => {
      let cart = { products: [], totalPrice: 0 };
      // 카트가 있는 경우(오류가 발생하지 않은 경우)
      if (!err) {
        cart = JSON.parse(fileContent);
      }
      // 해당 상품이 이미 있는지 확인
      const existingProductIndex = cart.products.findIndex((prod) => prod.id === id);
      const existingProduct = cart.products[existingProductIndex];
      let updatedProduct;
      // 해당 상품이 있다면 수량 증가
      if (existingProduct) {
        updatedProduct = { ...existingProduct };
        updatedProduct.quantity = updatedProduct.quantity + 1;
        cart.products = [...cart.products];
        cart.products[existingProductIndex] = updatedProduct;
      }
      // 해당 상품이 없는 새로운 상품이라면
      else {
        updatedProduct = { id: id, quantity: 1 };
        cart.products = [...cart.products, updatedProduct];
      }

      cart.totalPrice = cart.totalPrice + +productPrice; // +를 붙여 문자열을 숫자로 변환
      fs.writeFile(p, JSON.stringify(cart), (err) => {
        console.log(err);
      });
    });
  }
  static deleteProduct(id, productPrice) {
    fs.readFile(p, (err, fileContent) => {
      if (err) {
        return;
      }
      const updatedCart = { ...JSON.parse(fileContent) };
      const product = updatedCart.products.find((prod) => prod.id === id);
      const productQuantity = product.qty;
      updatedCart.products = updatedCart.products.filter((prod) => prod.id !== id);
      updatedCart.totalPrice = fileContent.totalPrice - productPrice * productQuantity;

      fs.writeFile(p, JSON.stringify(updatedCart), (err) => {
        console.log(err);
      });
    });
  }

  static getCart(callback) {
    fs.readFile(p, (err, fileContent) => {
      const cart = JSON.parse(fileContent);
      if (err) {
        callback(null);
      } else {
        callback(cart);
      }
    });
  }
};
