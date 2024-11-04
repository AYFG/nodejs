exports.getLogin = (req, res, next) => {
  const isLoggedIn = req.get("Cookie").split(";")[0].trim().split("=")[1];
  console.log(req.get("Cookie"));
  res.render("auth/login", {
    path: "/login",
    pageTitle: "Login",
    isAuthenticated: isLoggedIn,
  });
};

exports.postLogin = (req, res, next) => {
  res.setHeader("Set-Cookie", "loggedIn=true; HttpOnly");
  res.redirect("/");
};
