// terminal에서 pm2 start main.js --watch
// 로 실행시키면, 알아서 패키지매니저가 코드를 감지하고 있다가 변경된 부분을 잡아줌.
// monitoring 하고 싶으면 pm2 monit
// monitoring 끄고 싶으면 q 버튼
// log 보고 싶으면 pm2 log
// 끄고 싶으면 pm2 stop main


const http = require('http');
const fs = require('fs');
const url = require('url');
const qs = require('querystring');

function templatesHTML(title, list, body){
    return `
    <!doctype html>
    <html>
    <head>
        <title>WEB1 - ${title}</title>
    <meta charset="utf-8">
    </head>
    <body>
        <h1><a href="/">WEB2</a></h1>
        ${list}
        <a href = "/create">create</a>
        <a href = "/update">update</a>
        ${body}
    </body>
    </html>
    `
}

function listMaker(files){ 
    let list = '<ul>'; 
    files.forEach((file) => {
        list += `<li><a href = "/?id=${file}">${file}</a></li>`
    })
    list += '</ul>'

    return list
}

const app = http.createServer(function(request,response){
    // _request.url = url 주소를 보내준다. 슬래시(/)가 붙어서 온다.
    // _url = "/?id=html" 형식
    let _url = request.url;
    console.log(`_url = ${_url}`);
    // console.log(`_url=${_url}`);

    // parsedUrl = _url을 가지고 파싱해줌. 
    // parsedUrl = url.parse(_url,true) = {
    //     "protocol":null,
    //     "slashes":null,
    //     "auth":null,
    //     "host":null,
    //     "port":null,
    //     "hostname":null,
    //     "hash":null,
    //     "search":"?id=html&name=kenny",
    //     "query":{"id":"html","name":"kenny"}
    //     .
    //     .
    //     .
    // }
    let parsedUrl = url.parse(_url,true);
    // console.log(`parsedUrl = url.parse(_url,true) = ${JSON.stringify(parsedUrl)}`);

    // querydata = url.parse(_url,true) 에서 key 값이 query 인 것.
    let querydata = parsedUrl.query;
    // console.log(`querydata = parsedUrl.query = ${JSON.stringify(querydata)}`);

    // pathname = parsedUrl에서 key 값이 pathname인 것.
    let pathname = parsedUrl.pathname;
    console.log(`pathname = ${pathname}`);


    if(pathname === '/'){
        if(querydata.id === undefined){ // Home일때(pathname 이 / 하나만 있을 때)
            console.log("THis is Home");
            fs.readdir('./files', (err, files) => {// array : files 디렉토리 안의 파일명들
                let title = "Welcome";
                let list = listMaker(files);// listmaker 함수 안에 files라는 array를 집어넣음
                let desc = "Hello, World";

                let templates = templatesHTML(
                    title,
                    list,
                    `<h2>${title}</h2>
                    <p>${desc}</p>`
                    );
                response.writeHead(200);
                response.end(templates);
            })
        } else { // pathname이 / 하나이면서, 홈이 아닐 때(=querydata.id값이 있을 떄)
            fs.readdir('./files', (err, files) => { 
                fs.readFile(`./files/${querydata.id}`,'utf8',(err,desc) => {
                    let title = querydata.id;
                    let list = listMaker(files) 
                    let templates = templatesHTML(
                        title,
                        list,
                        `<h2>${title}</h2>
                        <p>${desc}</p>`
                        );

                    response.writeHead(200);
                    response.end(templates);
                });
            });
        }
    } else if (pathname === "/create"){ // 글 생성 폼이 있는 곳의 URL
        fs.readdir('./files', (err, files) => {
            let title = "Web - create";
            let list = listMaker(files);

            let templates = templatesHTML( // create_process URL로 데이터를 넘긴다.
                title,
                list,
                `<h2>${title}</h2>
                <form action="http://localhost:3000/create_process" method="post"> 
                <p><input type="text" name="title" placeholder="Title"></p>
                <p>
                    <textarea name="desc" placeholder="Desc"></textarea>
                </p>
                <p>
                    <input type="submit">
                </p>
                </form>
                `
                );
            response.writeHead(200);
            response.end(templates);
        })
    } else if(pathname === '/create_process'){ // 제출 버튼으로 전송된 post데이터 열람 URL
        let body = '';
        request.on('data', function(data){ // 데이터를 받아옴
            body += data;
        });
        request.on('end', function(){
            const post = qs.parse(body); // body에 있는 데이터들을 파싱 = object
            const title = post.title; // 여기서의 title은 post object의 key 값 이름
            const desc = post.desc // 이하 동문
            fs.writeFile(
                `./files/${title}`, // param1 : files 디렉토리 안에 title 변수로 된 파일 생성
                desc, // param2 : 파일에 들어갈 내용
                (err) => { // param3 : 에러 콜백 함수
                    if(err) throw error;
                    response.writeHead(302,
                        {Location : `/?id=${title}`}); // 302 코드로 redirection 보냄.
                    response.end();
            })
        });
    }else {
        response.writeHead(404);
        response.end('Not Found');
    }
    console.log("\n")
});
app.listen(3000);