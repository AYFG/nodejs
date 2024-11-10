const express = require("express");
const { check, body } = require("express-validator");

const authController = require("../controllers/auth");

const router = express.Router();

router.get("/login", authController.getLogin);
router.get("/signup", authController.getSignup);
router.get("/reset", authController.getReset);
router.get("/reset/:token", authController.getNewPassword);

router.post("/login", authController.postLogin);
router.post(
  "/signup",
  [
    check("email")
      .isEmail()
      .withMessage("유효한 이메일을 입력하세요")
      .custom((value, { req }) => {
        if (value === "tese@test.com") {
          throw new Error("This email address if forbidden");
        }
        return true;
      }),
    body("password", "5글자 이상 입력해주세요").isLength({ min: 5 }).isAlphanumeric(),
    body("confirmPassword").custom((value, { req }) => {
      if (value !== req.body.password) {
        throw new Error("비밀번호가 맞지 않습니다.");
      }
      return true;
    }),
  ],
  authController.postSignup,
);
router.post("/logout", authController.postLogout);
router.post("/reset", authController.postReset);
router.post("/new-password", authController.postNewPassword);

module.exports = router;
