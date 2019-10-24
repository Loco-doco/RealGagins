const http = require('http');
const fs = require('fs');
const url = require('url');
const qs = require('querystring');
const template = require('./lib/template.js');
const path = require('path');
const sanitizeHtml = require('sanitize-html');

const app = http.createServer(function(request,response){
console.log(`----------------------시이이자아아아악----------------------`);
    const _url = request.url;
    console.log(`받은 url은 ${_url} 입니다.`)
    const queryData = url.parse(_url, true).query;
    console.log(`queryData는 ${JSON.stringify(queryData)} 입니다`)
    console.log(`querydata.id 는 ${queryData.id} 입니다.`)
    const pathname = url.parse(_url, true).pathname;
    console.log(`pathname 은 ${pathname}입니다.`)
    if(pathname === '/'){
      if(queryData.id === undefined){
        fs.readdir('./data', function(error, filelist){
          console.log(`home 화면의 로직 수행중입니다`);
          let title = 'Welcome';
          let description = 'Hello, Node.js';
          let list = template.list(filelist);
          let html = template.HTML(title, list,
            `<h2>${title}</h2>${description}`,
            `<a href="/create">create</a>`
          );
          response.writeHead(200);
          response.end(html);
          console.log(`home 화면의 로직이 끝났습니다`);
        });
      } else {
        fs.readdir('./data', function(error, filelist){
          const filteredId = path.parse(queryData.id).base;
          console.log(`filtered ID 는 ${filteredId} 입니다`);
          console.log(`이제 data 안에 있는 ${filteredId} 파일을 읽을 겁니다`);
          fs.readFile(`data/${filteredId}`, 'utf8', function(err, description){
            let title = queryData.id;
            console.log(`title은 ${title} 입니다.`);
            let sanitizedTitle = sanitizeHtml(title);
            console.log(`sanitizedTitle 은 ${sanitizedTitle}입니다`);
            let sanitizedDescription = sanitizeHtml(description, {
              allowedTags:['h1']
            });
            let list = template.list(filelist);
            let html = template.HTML(sanitizedTitle, list,
              `<h2>${sanitizedTitle}</h2>${sanitizedDescription}`,
              ` <a href="/create">create</a>
                <a href="/update?id=${sanitizedTitle}">update</a>
                <form action="delete_process" method="post">
                  <input type="hidden" name="id" value="${sanitizedTitle}">
                  <input type="submit" value="delete">
                </form>`
            );
            response.writeHead(200);
            response.end(html);
            console.log(`${filteredId} 파일을 다 읽었습니다.`)
          });
        });
      }
    } else if(pathname === '/create'){
      fs.readdir('./data', function(error, filelist){
        console.log(`/create 화면으로 들어갑니다`);
        let title = 'WEB - create';
        let list = template.list(filelist);
        let html = template.HTML(title, list, `
          <form action="/create_process" method="post">
            <p><input type="text" name="title" placeholder="title"></p>
            <p>
              <textarea name="description" placeholder="description"></textarea>
            </p>
            <p>
              <input type="submit">
            </p>
          </form>
        `, '');
        response.writeHead(200);
        response.end(html);
        console.log(`/create 화면에서 나옵니다`);
      });
    } else if(pathname === '/create_process'){
      console.log(`/create_process 를 거치는 중입니다.`)
      let body = '';
      request.on('data', function(data){
          body = body + data;
      });
      request.on('end', function(){
          let post = qs.parse(body);
          let title = post.title;
          let description = post.description;
          console.log(`${title}라는 이름의 파일을 생성할 예정입니다.`)
          fs.writeFile(`data/${title}`, description, 'utf8', function(err){
            console.log(`"/?id=${title} 이라는 이름의 경로로 보내버립니다.
            `)
            response.writeHead(302, {Location: `/?id=${title}`});
            response.end();
          })
          console.log(`${title}라는 이름의 파일을 생성했습니다.`)
      });
    } else if(pathname === '/update'){
      console.log(`update URL로 들어갑니다`)
      fs.readdir('./data', function(error, filelist){
        const filteredId = path.parse(queryData.id).base;
        console.log(`${filteredId}라는 filteredId변수를 만들었습니다.`)
        fs.readFile(`data/${filteredId}`, 'utf8', function(err, description){
          let title = queryData.id;
          let list = template.list(filelist);
          let html = template.HTML(title, list,
            `
            <form action="/update_process" method="post">
              <input type="hidden" name="id" value="${title}">
              <p><input type="text" name="title" placeholder="title" value="${title}"></p>
              <p>
                <textarea name="description" placeholder="description">${description}</textarea>
              </p>
              <p>
                <input type="submit">
              </p>
            </form>
            `,
            `<a href="/create">create</a> <a href="/update?id=${title}">update</a>`
          );
          response.writeHead(200);
          response.end(html);
        });
      });
    } else if(pathname === '/update_process'){
      console.log(`update process 진행중입니다.`)
      let body = '';
      request.on('data', function(data){
          console.log(`post 요청으로 들어온 데이터는 ${JSON.stringify(data)}입니다.
          `)
          body = body + data;
      });
      request.on('end', function(){
          let post = qs.parse(body);
          console.log(`post 데이터를 파싱한 결과는 ${JSON.stringify(post)} 입니다.
          `)
          let id = post.id;
          let title = post.title;
          let description = post.description;
          console.log(`파일 이름을 ${id}에서 ${title}로 바꾸고 있습니다.`)
          fs.rename(`data/${id}`, `data/${title}`, function(error){
            console.log(`${title}이름의 파일을 만들고 있습니다`)
            fs.writeFile(`data/${title}`, description, 'utf8', function(err){
              console.log(`"/?id=${title}" 주소로 보내버립니다.
              `)
              response.writeHead(302, {Location: `/?id=${title}`});
              response.end();
            })
          });
      });
    } else if(pathname === '/delete_process'){
      let body = '';
      request.on('data', function(data){
          body = body + data;
      });
      request.on('end', function(){
          let post = qs.parse(body);
          let id = post.id;
          let filteredId = path.parse(id).base;
          fs.unlink(`data/${filteredId}`, function(error){
            response.writeHead(302, {Location: `/`});
            response.end();
          })
      });
    } else {
      response.writeHead(404);
      response.end('Not found');
    }
});
app.listen(3000);