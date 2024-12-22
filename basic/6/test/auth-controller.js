const expect = require("chai").expect;
const sinon = require("sinon");

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
});
