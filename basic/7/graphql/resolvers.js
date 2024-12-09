const bcrypt = require("bcryptjs");
const validator = require("validator");

const User = require("../models/user");

module.exports = {
  createUser: async function ({ userInput }, req) {
    const errors = [];
    if (!validator.isEmail(userInput.email)) {
      errors.push({ message: "이메일이 잘못되었습니다" });
    }
    if (
      !validator.isEmpty(userInput.password) ||
      !validator.isLength(userInput.password, { min: 5 })
    ) {
      errors.push({ message: "비밀번호가 너무 짧습니다." });
    }
    const existingUser = await User.findOne({ email: userInput.email });
    if (existingUser) {
      const error = new Error("이미 사용중인 이메일입니다.");
    }
    if (errors.length > 0) {
      const error = new Error("잘못된 입력이 있습니다.");
      error.data = errors;
      error.code = 422;
      throw error;
    }
    const hashedPw = await bcrypt.hash(userInput.password, 12);
    const user = new User({
      email: userInput.email,
      name: userInput.name,
      password: hashedPw,
    });
    const createdUser = await user.save();
    return {
      ...createdUser._doc,
      _id: createdUser._id.toString(),
    };
  },
};
