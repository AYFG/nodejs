const http = require("http");

const server = http.createServer((req,res) => {
    console.log(req.url, req.method, req.headers);

    // localhost:3000의 요청이 없어서 node app.js를 해도 반응이 없지만 브라우저로 접속을 하면 server 함수가 실행되고 process.exit()이 실행되어 프로그램을 종료한다.
    // process.exit();

    res.setHeader("Content-Type", "text/html");
    res.write('<html>');
    res.write('<head> <title> my First Page </title></head>');
    res.write("<body><h1>Hello from my Node.js Server</h1></body>");
    res.write('</html>');
    res.end();
});


server.listen(3000);

