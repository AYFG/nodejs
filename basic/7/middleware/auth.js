const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {
  const authHeader = req.get("Authorization");
  if (!authHeader) {
    req.isAuth = false;
    return next();
  }

  const token = authHeader.split(" ")[1];
  if (!token) {
    req.isAuth = false;
    return next();
  }

  let decodedToken;
  try {
    decodedToken = jwt.verify(token, "somesupersecretsecret");
  } catch (err) {
    console.log("Token verification failed:", err.message);
    req.isAuth = false;
    return next();
  }

  if (!decodedToken) {
    console.log("Decoded token is null");
    req.isAuth = false;
    return next();
  }
  console.log(req.isAuth);

  req.userId = decodedToken.userId;
  req.isAuth = true;
  next();
};
