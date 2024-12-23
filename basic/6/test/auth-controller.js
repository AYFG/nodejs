const expect = require("chai").expect;
const sinon = require("sinon");
const mongoose = require("mongoose");

const User = require("../models/user");
const AuthController = require("../controllers/auth");

describe("Auth Controller - Login", function () {
  it("데이터베이스에 접근하지 못하면 코드 500에 오류를 제기해야 합니다", function (done) {
    sinon.stub(User, "findOne");
    User.findOne.rejects();

    const req = {
      body: {
        email: "test@test.com",
        password: "tester",
      },
    };

    AuthController.login(req, {}, () => {})
      .then((result) => {
        expect(result).to.be.an("error");
        expect(result).to.have.property("statusCode", 500);
        done();
      })
      .catch(done);

    User.findOne.restore();
  });

  it("기존 사용자의 유효한 사용자 상태로 응답을 보내야 합니다", function (done) {
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
        const req = { userId: "6756c46008f7e34a029ae7a3" };
        const res = {
          statusCode: 500,
          userStatus: null,
          status: function (code) {
            this.statusCode = code;
            return this;
          },
          json: function (data) {
            this.userStatus = data.status;
          },
        };
        AuthController.getUserStatus(req, res, () => {}).then(() => {
          expect(res.statusCode).to.be.equal(200);
          expect(res.userStatus).to.be.equal("I am new!");
          User.deleteMany({}).then(() => {
            return mongoose.disconnect().then(() => {
              done();
            });
          });
        });
      })

      .catch((err) => console.error(err));
  });
});
