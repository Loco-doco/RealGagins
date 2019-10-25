const http = require('http');
const fs = require('fs');
const url = require('url');
const qs = require('querystring');
const template = require('./lib/template.js');
const path = require('path');
const sanitizeHtml = require('sanitize-html');
const mysql = require('mysql');
const db = mysql.createConnection({
    host : 'localhost',
    user : 'root',
    password : '123123',
    database : 'nodeTest'
});
db.connect();


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
        db.query(`SELECT * FROM topic`, (err,result) => {
          console.log(result);
          let title = 'Welcome';
          let description = 'Hello, Node.js';
          let list = template.list(result);
          let html = template.HTML(title, list,
            `<h2>${title}</h2>${description}`,
            `<a href="/create">create</a>`
          );
          response.writeHead(200);
          response.end(html);
        });
      } else {
        db.query(`SELECT * FROM topic`, (err,filelist) => {
          if (err) throw err;
          db.query(`
            SELECT id,title,description FROM topic WHERE id=?`,
            [queryData.id],
            (err, result) => {
              if (err) throw err;

              console.log(result);
              let title = result[0].title; // result 배열의 첫번째 객체의 title 프로퍼티
              let description = result[0].description;
              let list = template.list(filelist);
              let html = template.HTML(title, list,
                `<h2>${title}</h2>${description}`,
                ` <a href="/create">create</a>
                  <a href="/update?id=${queryData.id}">update</a>
                  <form action="delete_process" method="post">
                    <input type="hidden" name="id" value="${queryData.id}">
                    <input type="submit" value="delete">
                  </form>`
              );
              // console.log(result);
              response.writeHead(200);
              response.end(html);
            }
          )
        });
      }
    } else if(pathname === '/create'){
      db.query(`SELECT * FROM topic`, (err, result) => {
        let title = `Create`;
        let list = template.list(result);
        let html = template.HTML(title, list,`
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
      });
    } else if(pathname === '/create_process'){ 
      console.log(`/create_process 를 거치는 중입니다.`)
      let body = '';

      request.on('data', function(data){ // body라는 변수에 post로 들고온 data를 넣어줌
          body = body + data;
      });

      request.on('end', () => {
          let post = qs.parse(body);
          console.log(`post 값(body를 파싱한 값)은 ${body} 입니다.`)
          // body에 들어가있는 post 데이터를 db에 넣음
          db.query(`
            INSERT INTO topic(title, description, created, author_id)
            VALUES(?, ?, NOW(), ?)`,
            [post.title, post.description, 1],
            (err, result) => {
              if(err) throw err;
              response.writeHead(302, {Location: `/?id=${result.insertId}`});
              response.end();
            }
          )
      });
    } else if(pathname === '/update'){
      console.log(`update URL로 들어갑니다`)
      db.query(`SELECT * FROM topic`,(err, result) => {
          if (err) throw err;
          db.query(`
            SELECT id, title, description, created, author_id
            FROM topic WHERE id=?`,
            [queryData.id],
            (err2,result2) => {
              if(err2) throw err2;
              let id = result2[0].id;
              let title = result2[0].title;
              let list = template.list(result);
              let description = result2[0].description;
              let html = template.HTML(title, list,
                `
                <form action="/update_process" method="post">
                  <input type="hidden" name="id" value="${id}">
                  <p><input type="text" name="title" placeholder="title" value="${title}"></p>
                  <p>
                    <textarea name="description" placeholder="description">${description}</textarea>
                  </p>
                  <p>
                    <input type="submit">
                  </p>
                </form>
                `,
                `<a href="/create">create</a> <a href="/update?id=${id}">update</a>`)
              response.writeHead(200);
              response.end(html);
            })
        }
      )
    } else if(pathname === '/update_process'){
      console.log(`update process 진행중입니다.`)
      let body = '';

      request.on('data', function(data){
        body = body + data;
      });

      request.on('end', () => {
        let post = qs.parse(body);
        console.log(`post 값(body를 파싱한 값)은 ${body} 입니다.`)
        db.query(`
          UPDATE topic 
          SET title=?, description=?, author_id=1 WHERE id=?`,
          [post.title, post.description, post.id],
          (err, result) => {
            if(err) throw err;
            response.writeHead(302, {Location: `/?id=${post.id}`});
            response.end();
          }
        )
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