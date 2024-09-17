const fs = require("fs");

const requestHandler = (req, res) => {
  const url = req.url;
  const method = req.method;
  if (url === "/") {
    res.write("<html>");
    res.write("<head> <title> my First Page </title></head>");
    res.write(
      "<body><form action='/message' method='POST'><input type='text' name='message'/><button type='submit'>Send</button></form></body>",
    );
    res.write("</html>");
    return res.end();
  }
  if (url === "/message" && method === "POST") {
    const body = [];
    req.on("data", (chunk) => {
      console.log(chunk);
      body.push(chunk);
    }); // 이벤트를 들을 수 있다
    req.on("end", () => {
      const parsedBody = Buffer.concat(body).toString(); // Buffer == 버스정류장
      console.log(parsedBody);
      const message = parsedBody.split("=")[1];
      // fs.writeFileSync("message.txt", message); //동기적으로 파일 생성 전까지 코드 실행을 막는 메서드
      fs.writeFile("message.txt", message, (err) => {
        // 비동기식
        res.statusCode = 302;
        res.setHeader("Location", "/");
        return res.end();
      });
    });
  }

  res.setHeader("Content-Type", "text/html");
  res.write("<html>");
  res.write("<head> <title> my First Page </title></head>");
  res.write("<body><h1>Hello from my Node.js Server</h1></body>");
  res.write("</html>");
  res.end();
};

// module.exports = requestHandler; // 하나의 함수 내보내기

// module.exports = { // 객체로 여러개 합쳐 내보내기
//   handler: requestHandler,
//   someText: "Some hard coded text",
// };

// module.exports.handler = requestHandler; //
// module.exports.someText = "Some hard coded Text";

exports.handler = requestHandler; // Node.js 단축키
exports.someText = "Some hard coded Text";
