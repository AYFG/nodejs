const expect = require("chai").expect;
const jwt = require("jsonwebtoken");
const sinon = require("sinon");
const authMiddleware = require("../middleware/is-auth");

describe("Auth Middleware", function () {
  it("승인 헤더가 없는 경우 오류를 제기해야 합니다", function () {
    const req = {
      get: function (headerName) {
        return null;
      },
    };
    expect(authMiddleware.bind(this, req, {}, () => {})).to.throw("인증에 실패했습니다.");
  });
  it("토큰이 확인되면 유저아이디를 반환합니다.", function () {
    const req = {
      get: function (headerName) {
        return "Bearer xyz";
      },
    };
    // 수동으로 써드파티 라이브러리 메서드를 교체하면 다른 테스트에서 원본 메스드를 필요로 할 때 수동으로 교체된 라이브러리가 사용되어 큰 단점
    // jwt.verify = function () {
    //   return { userId: "abc" };
    // };

    //sinon의 stub으로 메서드 동작을 바꾸고 restore로 원래대로 복원
    sinon.stub(jwt, "verify");
    jwt.verify.returns({ userId: "abc" });
    authMiddleware(req, {}, () => {});
    expect(req).to.have.property("userId");
    jwt.verify.restore();
  });
  it("인증 헤더가 하나의 문자열일 경우 오류를 제기해야 합니다", function () {
    const req = {
      get: function (headerName) {
        return "xyz";
      },
    };
    expect(authMiddleware.bind(this, req, {}, () => {})).to.throw();
  });
});
