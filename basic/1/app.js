const http = require("http");

const server = http.createServer((req,res) => {
    console.log(req.url, req.method, req.headers);

    // localhost:3000의 요청이 없어서 node app.js를 해도 반응이 없지만 브라우저로 접속을 하면 server 함수가 실행되고 process.exit()이 실행되어 프로그램을 종료한다.
    // process.exit();

});


server.listen(3000);
