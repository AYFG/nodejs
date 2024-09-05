const express = require("express");

const app = express();

// 미들웨어 추가
app.use((req, res, next) => {
  console.log("In the middleware");
  next();
});
// 위의 middleware에서 next가 호출되지 않으면 넘어오지 않는다
app.use((req, res, next) => {
  console.log("In another middleware");
  res.send("<h1>Hello from Express</h1>");
});

app.listen(3000);
