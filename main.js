// terminal에서 pm2 start main.js --watch
// 로 실행시키면, 알아서 패키지매니저가 코드를 감지하고 있다가 변경된 부분을 잡아줌.
// monitoring 하고 싶으면 pm2 monit
// monitoring 끄고 싶으면 q 버튼
// log 보고 싶으면 pm2 log
// 끄고 싶으면 pm2 stop main

const http = require('http');
const url = require('url');
const qs = require('querystring');
const template = require('./lib/template.js');
const db = require('./lib/db');
const topic = require('./lib/topic')


const app = http.createServer(function(request,response){
console.log(`----------------------시이이자아아아악----------------------`);
    const _url = request.url;
    // console.log(`받은 url은 ${_url} 입니다.`)
    const queryData = url.parse(_url, true).query;
    // console.log(`queryData는 ${JSON.stringify(queryData)} 입니다`)
    // console.log(`querydata.id 는 ${queryData.id} 입니다.`)
    const pathname = url.parse(_url, true).pathname;
    // console.log(`pathname 은 ${pathname}입니다.`)

    if(pathname === '/'){
      if(queryData.id === undefined){
        topic.home(request, response);
      } else {
        topic.page(request,response,queryData.id);
      }
    } else if(pathname === '/create'){
      topic.create(request,response);
    } else if(pathname === '/create_process'){ 
      topic.createProcess(request,response);
    } else if(pathname === '/update'){
      topic.update(request,response,queryData.id);
    } else if(pathname === '/update_process'){
      topic.updateProcess(request,response);
    } else if(pathname === '/delete_process'){
      topic.deleteProcess(request,response);
    } else {
      response.writeHead(404);
      response.end('Not found');
    }
});
app.listen(3000);