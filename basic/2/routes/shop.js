const path = require("path");

const express = require("express");

const rootDir = require("../util/path");
const adminData = require("./admin");

const router = express.Router();

router.get("/", (req, res, next) => {
  //   res.send("<h1>Hello from Express!</h1>");
  //   res.sendFile("./views/shop.html");
  // console.log("shop.js", adminData.products);
  // res.sendFile(path.join(rootDir, "..", "2/views", "shop.html"));
  res.render("shop");
});

module.exports = router;
