const path = require("path");

const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");

require("dotenv").config();
const DATABASE_PASSWORD = process.env.DATABASE_PASSWORD;

const MongoDB_URI = `mongodb+srv://sek82468246:${DATABASE_PASSWORD}@cluster0.xupmv.mongodb.net/messages?retryWrites=true&w=majority&appName=Cluster0`;

const feedRoutes = require("./routes/feed");

const app = express();

app.use(bodyParser.json());
app.use("/images", express.static(path.join(__dirname, "images")));

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "http://localhost:3000");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, PATCH, DELETE");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
  next();
});

app.use("/feed", feedRoutes);

app.use((error, req, res, next) => {
  console.log(error);
  const status = error.statusCode || 500;
  const message = error.message;
  res.status(status).json({ message: message });
});

mongoose
  .connect(MongoDB_URI)
  .then((result) => {
    app.listen(8080);
  })
  .catch((err) => console.error(err));
