const expect = require("chai").expect;
const sinon = require("sinon");
const mongoose = require("mongoose");

const User = require("../models/user");
const FeedController = require("../controllers/feed");

describe("Feed Controller - Login", function () {
  before(function (done) {
    require("dotenv").config();
    const DATABASE_ID = process.env.DATABASE_ID;
    const DATABASE_PASSWORD = process.env.DATABASE_PASSWORD;
    const MongoDB_URI = `mongodb+srv://${DATABASE_ID}:${DATABASE_PASSWORD}@cluster0.xupmv.mongodb.net/test-messages?retryWrites=true&w=majority&appName=Cluster0`;

    mongoose
      .connect(MongoDB_URI)
      .then((result) => {
        const user = new User({
          email: "test@test.com",
          password: "tester",
          name: "Test",
          posts: [],
          _id: "6756c46008f7e34a029ae7a3",
        });
        return user.save();
      })
      .then(() => {
        done();
      });
  });

  it("생성된 게시물을 생성자의 게시물에 추가해야 합니다", function (done) {
    const req = {
      body: {
        title: "Test Post",
        content: "A Test Post",
      },
      file: {
        path: "abc",
      },
      userId: "6756c46008f7e34a029ae7a3",
    };
    const res = {
      status: function () {
        return this;
      },
      json: function () {},
    };

    FeedController.createPost(req, res, () => {})
      .then((savedUser) => {
        expect(savedUser).to.have.property("posts");
        expect(savedUser.posts).to.have.length(1);
        done();
      })
      .catch(done);
  });

  after(function (done) {
    User.deleteMany({})
      .then(() => {
        return mongoose.disconnect();
      })
      .then(() => {
        done();
      });
  });
});
