const path = require("path");
const express = require("express");
const rootDir = require("../util/path");
const router = express.Router();

router.get("/", (req, res, next) => {
  //   res.send("<h1>Hello from Express!</h1>");
  //   res.sendFile("./views/shop.html");
  res.sendFile(path.join(rootDir, "..", "2/views", "shop.html"));
});

module.exports = router;
