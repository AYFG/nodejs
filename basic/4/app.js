const path = require("path");

const express = require("express");
const bodyParser = require("body-parser");

const errorController = require("./controllers/error");
// sequelize 적용 전
// const db = require("./util/database");
const sequelize = require("./util/database");
const Product = require("./models/products");
const User = require("./models/user");

const app = express();

app.set("view engine", "ejs");
app.set("views", "views");

const adminRoutes = require("./routes/admin");
const shopRoutes = require("./routes/shop");

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, "public")));

app.use((req, res, next) => {
  User.findByPk(1)
    .then((user) => {
      req.user = user;
      next();
    })
    .catch((err) => {
      console.error(err);
    });
});

app.use("/admin", adminRoutes);
app.use(shopRoutes);

app.use(errorController.get404);

// 관계 설정
Product.belongsTo(User, { constraints: true, onDelete: "CASCADE" });
User.hasMany(Product);

// db 테이블 생성 (이미 있는 테이블은 다시 생성하지 않음)
sequelize
  // 테이블 다시 생성하고 싶을 때
  // .sync({ force: true })
  .sync()
  .then((result) => {
    return User.findByPk(1);
    // app.listen(3000);
  })
  .then((user) => {
    if (!user) {
      return User.create({ email: "test@test.com", name: "woong" });
    }
    return User;
  })
  .then((user) => {
    console.log(user);
    app.listen(3000);
  })
  .catch((err) => {
    console.error(err);
  });
