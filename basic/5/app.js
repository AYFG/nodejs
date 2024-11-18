const path = require("path");

const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const session = require("express-session");
const MongoDBStore = require("connect-mongodb-session")(session);
const csrf = require("csurf");
const flash = require("connect-flash");
const multer = require("multer");

require("dotenv").config();
const DATABASE_PASSWORD = process.env.DATABASE_PASSWORD;

const errorController = require("./controllers/error");

const User = require("./models/user");

const MongoDB_URI = `mongodb+srv://sek82468246:${DATABASE_PASSWORD}@cluster0.xupmv.mongodb.net/shop?retryWrites=true&w=majority&appName=Cluster0`;

const app = express();
const store = new MongoDBStore({
  uri: MongoDB_URI,
  collection: "sessions",
});
const csrfProtection = csrf({});

const fileStorage = multer.diskStorage({
  destination: (req, file, callback) => {
    callback(null, "images");
  },
  filename: (req, file, callback) => {
    callback(null, Date.now() + file.originalname);

    // TypeError: Cannot read properties of undefined (reading 'isLoggedIn')

    // debug :
    // Date.prototype.toISOString()은 YYYY-MM-DDTHH:mm:ss.sssZ 또는 ±YYYYYY-MM-DDTHH:mm:ss.sssZ 로 반환하는데 windows 운영체제에서의 파일명은 콜론(:)을 허용하지 않아서 생긴 오류
    // 개선 전 : callback(null, new Date().toISOString()+ file.originalname);

    // 개선 후 : callback(null, new Date().toISOString().replace(/:/g, "-") + file.originalname);
  },
});

const fileFilter = (req, file, cb) => {
  if (
    file.mimetype === "image/png" ||
    file.mimetype === "image/jpg" ||
    file.mimetype === "image/jpeg"
  ) {
    cb(null, true);
  } else {
    cb(null, false);
  }
};

app.set("view engine", "ejs");
app.set("views", "views");

const adminRoutes = require("./routes/admin");
const shopRoutes = require("./routes/shop");
const authRoutes = require("./routes/auth");

app.use(bodyParser.urlencoded({ extended: false }));
app.use(multer({ storage: fileStorage, fileFilter: fileFilter }).single("image"));
app.use(express.static(path.join(__dirname, "public")));
app.use("/images", express.static(path.join(__dirname, "images")));
app.use(session({ secret: "my secret", resave: false, saveUninitialized: false, store: store }));

app.use(csrfProtection);
app.use(flash());

app.use((req, res, next) => {
  res.locals.isAuthenticated = req.session.isLoggedIn;
  res.locals.csrfToken = req.csrfToken();
  next();
});

app.use((req, res, next) => {
  if (!req.session.user) {
    return next();
  }
  User.findById(req.session.user._id)
    .then((user) => {
      if (!user) {
        return next();
      }
      req.user = user;
      next();
    })
    .catch((err) => {
      next(new Error(err));
    });
});

app.use("/admin", adminRoutes);
app.use(shopRoutes);
app.use(authRoutes);

app.get("/500", errorController.get500);
app.use(errorController.get404);

app.use((error, req, res, next) => {
  // res.redirect("/500");
  res.status(500).render("500", {
    pageTitle: "Error!",
    path: "/500",
    isAuthenticated: req.session.isLoggedIn,
  });
});

mongoose
  .connect(MongoDB_URI)
  .then((result) => {
    app.listen(3000);
  })
  .catch((err) => {
    console.error(err);
  });
