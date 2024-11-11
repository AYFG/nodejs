const express = require("express");
const { check, body } = require("express-validator");

const authController = require("../controllers/auth");
const User = require("../models/user");

const router = express.Router();

router.get("/login", authController.getLogin);
router.get("/signup", authController.getSignup);
router.get("/reset", authController.getReset);
router.get("/reset/:token", authController.getNewPassword);

router.post(
  "/login",
  [
    body("email").isEmail().withMessage("유효한 이메일을 입력하세요").normalizeEmail(),
    body("password").isLength({ min: 5 }).isAlphanumeric().trim(),
  ],

  authController.postLogin,
);

router.post(
  "/signup",
  [
    check("email")
      .isEmail()
      .withMessage("유효한 이메일을 입력하세요")
      .custom((value, { req }) => {
        // if (value === "tese@test.com") {
        //   throw new Error("This email address if forbidden");
        // }
        // return true;
        return User.findOne({ email: value }).then((userDoc) => {
          if (userDoc) {
            return Promise.reject("이미 사용중인 이메일입니다. 다른 이메일을 사용해주세요.");
          }
        });
      })
      .normalizeEmail(),
    body("password", "5글자 이상 입력해주세요").isLength({ min: 5 }).isAlphanumeric().trim(),
    body("confirmPassword")
      .trim()
      .custom((value, { req }) => {
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
