const bcrypt = require("bcryptjs");
const validator = require("validator");
const jwt = require("jsonwebtoken");

const User = require("../models/user");
const Post = require("../models/post");
const { clearImage } = require("../util/file");

module.exports = {
  createUser: async function ({ userInput }, req) {
    const errors = [];
    if (!validator.isEmail(userInput.email)) {
      errors.push({ message: "이메일이 잘못되었습니다" });
    }
    if (
      validator.isEmpty(userInput.password) ||
      !validator.isLength(userInput.password, { min: 5 })
    ) {
      errors.push({ message: "비밀번호가 너무 짧습니다." });
    }
    if (errors.length > 0) {
      const error = new Error("잘못된 입력이 있습니다.");
      error.data = errors;
      error.code = 422;
      throw error;
    }
    const existingUser = await User.findOne({ email: userInput.email });
    if (existingUser) {
      const error = new Error("이미 사용중인 이메일입니다.");
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

  login: async function ({ email, password }) {
    const user = await User.findOne({ email: email });
    if (!user) {
      const error = new Error("등록되지 않은 회원입니다.");
      error.code = 401;
      throw error;
    }
    const isEqual = await bcrypt.compare(password, user.password);
    if (!isEqual) {
      const error = new Error("비밀번호가 맞지 않습니다.");
      error.code = 401;
      throw error;
    }
    const token = jwt.sign(
      {
        email: user.email,
        userId: user._id.toString(),
      },
      "somesupersecretsecret",
      { expiresIn: "1h" },
    );
    return { token: token, userId: user._id.toString() };
  },
  createPost: async function ({ postInput }, req) {
    console.log("test", req);
    if (!req.raw.isAuth) {
      const error = new Error("인증되지 않음");
      error.code = 401;
      throw error;
    }
    const errors = [];

    if (validator.isEmpty(postInput.title) || !validator.isLength(postInput.title, { min: 5 })) {
      errors.push({ message: "제목이 잘못되었습니다" });
    }
    if (
      validator.isEmpty(postInput.content) ||
      !validator.isLength(postInput.content, { min: 5 })
    ) {
      errors.push({ message: "내용이 잘못되었습니다" });
    }
    if (errors.length > 0) {
      const error = new Error("잘못된 입력이 있습니다.");
      error.data = errors;
      error.code = 422;
      throw error;
    }
    const user = await User.findById(req.raw.userId);
    if (!user) {
      const error = new Error("인증되지 않은 유저입니다.");
      error.code = 401;
      throw error;
    }
    const post = new Post({
      title: postInput.title,
      content: postInput.content,
      imageUrl: postInput.imageUrl,
      creator: user,
    });
    const createdPost = await post.save();
    user.posts.push(createdPost);
    await user.save();
    return {
      ...createdPost._doc,
      _id: createdPost._id.toString(),
      createdAt: createdPost.createdAt.toString(),
      updatedAt: createdPost.updatedAt.toString(),
    };
  },
  posts: async function ({ page }, req) {
    if (!req.raw.isAuth) {
      const error = new Error("인증되지 않았습니다.");
      error.code = 401;
      throw error;
    }
    if (!page) {
      page = 1;
    }
    const perPage = 2;

    const totalPosts = await Post.find().countDocuments();
    const posts = await Post.find()
      .sort({ createdAt: -1 })
      .skip((page - 1) * perPage)
      .limit(perPage)
      .populate("creator");
    return {
      posts: posts.map((p) => {
        return {
          ...p._doc,
          _id: p._id.toString(),
          createdAt: p.createdAt.toISOString(),
          updatedAt: p.updatedAt.toISOString(),
        };
      }),
      totalPosts: totalPosts,
    };
  },
  post: async function ({ id }, req) {
    if (!req.raw.isAuth) {
      const error = new Error("인증되지 않았습니다.");
      error.code = 401;
      throw error;
    }
    const post = await Post.findById(id).populate("creator");
    if (!post) {
      const error = new Error("게시물을 찾을 수 없습니다.");
      error.code = 404;
      throw error;
    }
    console.log(post);
    return {
      ...post._doc,
      _id: post._id.toString(),
      createdAt: post.createdAt.toISOString(),
      updatedAt: post.updatedAt.toISOString(),
    };
  },
  updatePost: async function ({ id, postInput }, req) {
    if (!req.raw.isAuth) {
      const error = new Error("인증되지 않았습니다.");
      error.code = 401;
      throw error;
    }
    const post = await Post.findById(id).populate("creator");
    if (!post) {
      const error = new Error("게시물을 찾을 수 없습니다.");
      error.code = 404;
      throw error;
    }
    if (post.creator._id.toString() !== req.raw.userId.toString()) {
      const error = new Error("인증되지 않은 사용자입니다.");
      error.code = 403;
      throw error;
    }
    const errors = [];

    if (validator.isEmpty(postInput.title) || !validator.isLength(postInput.title, { min: 5 })) {
      errors.push({ message: "제목이 잘못되었습니다" });
    }
    if (
      validator.isEmpty(postInput.content) ||
      !validator.isLength(postInput.content, { min: 5 })
    ) {
      errors.push({ message: "내용이 잘못되었습니다" });
    }
    if (errors.length > 0) {
      const error = new Error("잘못된 입력이 있습니다.");
      error.data = errors;
      error.code = 422;
      throw error;
    }
    const user = await User.findById(req.raw.userId);
    if (!user) {
      const error = new Error("인증되지 않은 유저입니다.");
      error.code = 401;
      throw error;
    }
    post.title = postInput.title;
    post.content = postInput.content;
    if (postInput.imageUrl !== "undefined") {
      post.imageUrl = postInput.imageUrl;
    }
    const updatedPost = await post.save();
    return {
      ...updatedPost._doc,
      _id: updatedPost._id.toString(),
      createdAt: updatedPost.createdAt.toISOString(),
      updatedAt: updatedPost.updatedAt.toISOString(),
    };
  },
  deletePost: async function ({ id }, req) {
    if (!req.raw.isAuth) {
      const error = new Error("인증되지 않았습니다.");
      error.code = 401;
      throw error;
    }
    const post = await Post.findById(id);
    if (!post) {
      const error = new Error("게시물을 찾을 수 없습니다.");
      error.code = 404;
      throw error;
    }
    if (post.creator._id.toString() !== req.raw.userId.toString()) {
      const error = new Error("인증되지 않은 사용자입니다.");
      error.code = 403;
      throw error;
    }
    clearImage(post.imageUrl);
    await Post.findByIdAndDelete(id);
    const user = await User.findById(req.raw.userId);
    user.posts.pull(id);
    await user.save();
    return true;
  },
  user: async function (_, req) {
    if (!req.raw.isAuth) {
      const error = new Error("인증되지 않았습니다.");
      error.code = 401;
      throw error;
    }
    const user = await User.findById(req.raw.userId);
    if (!user) {
      if (!post) {
        const error = new Error("게시물을 찾을 수 없습니다.");
        error.code = 404;
        throw error;
      }
      return { ...user._doc, _id: user._id.toString() };
    }
  },
  updateStatus: async function ({ status }, req) {
    if (!req.raw.isAuth) {
      const error = new Error("인증되지 않았습니다.");
      error.code = 401;
      throw error;
    }
    const user = await User.findById(req.raw.userId);
    if (!user) {
      const error = new Error("인증되지 않은 유저입니다.");
      error.code = 404;
      throw error;
    }
    user.status = status;
    await user.save();
    return { ...user._doc, _id: user._id.toString() };
  },
};
