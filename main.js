const http = require('http');
const fs = require('fs');
const url = require('url');

function templatesHTML(title, list, body){
    return `
    <!doctype html>
    <html>
    <head>
    <title>WEB1 - ${title}</title>
    <meta charset="utf-8">
    </head>
    <body>
    <h1><a href="/">WEB</a></h1>
    ${list}
    ${body}
    </body>
    </html>
    `
}

function listMaker(files){
    let list = '<ul>';
    files.forEach((file) => {
        console.log(`파일(file) = ${file}`)
        list += `<li><a href = "/?id=${file}">${file}</a></li>`
        console.log(`리스트(list) = ${list}`)
        console.log("\n")
    })
    list += '</ul>'

    return list
}

const app = http.createServer(function(request,response){
    // _request.url = url 주소를 보내준다. 슬래시(/)가 붙어서 온다.
    // _url = "/?id=html" 형식
    let _url = request.url;
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
    console.log(`parsedUrl = url.parse(_url,true) = ${JSON.stringify(parsedUrl)}`);

    // querydata = url.parse(_url,true) 에서 key 값이 query 인 것.
    let querydata = parsedUrl.query;
    // console.log(`querydata = parsedUrl.query = ${JSON.stringify(querydata)}`);

    // pathname = parsedUrl에서 key 값이 pathname인 것.
    // querystring이면 pathname은 슬래시 하나밖에 없음
    let pathname = parsedUrl.pathname;
    console.log(pathname);


    if(pathname === '/'){
        if(querydata.id === undefined){ // _url 이 / 하나만 있을 때
            fs.readdir('./text', (err, files) => {
                console.log(files);
                let title = "Welcome";
                let list = listMaker(files);
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
        } else {
            fs.readdir('./text', (err, files) => {
                fs.readFile(`text/${querydata.id}`,'utf8',(err,desc) => {
                    console.log(files);
                    let title = querydata.id;
                    let list = listMaker(files);
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
    } else {
        response.writeHead(404);
        response.end('Not Found');
    }
    console.log("\n")
});
app.listen(3000);