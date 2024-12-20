const expect = require("chai").expect;

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

  it("인증 헤더가 하나의 문자열일 경우 오류를 제기해야 합니다", function () {
    const req = {
      get: function (headerName) {
        return "xyz";
      },
    };
    expect(authMiddleware.bind(this, req, {}, () => {})).to.throw();
  });
});
