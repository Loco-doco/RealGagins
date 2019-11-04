const db = require('./db');
const template = require('./template.js');
const qs = require('querystring');

exports.home = (request, response) => {
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
}

exports.page = (request, response,id) => {
    db.query(`SELECT * FROM topic`, (err,filelist) => {
        if (err) throw err;
        db.query(`
          SELECT topic.id,title,description,author_id,name,profile
          FROM topic 
          LEFT JOIN author
          ON author.id = topic.author_id
          WHERE topic.id=?`,
          [id],
          (err, result) => {
            if (err) throw err;

            console.log(result);
            let title = result[0].title; // result 배열의 첫번째 객체의 title 프로퍼티
            let description = result[0].description;
            let list = template.list(filelist);
            let html = template.HTML(title, list,
              `<h2>${title}</h2>${description}
              by ${result[0].name}`,
              ` <a href="/create">create</a>
                <a href="/update?id=${id}">update</a>
                <form action="delete_process" method="post">
                  <input type="hidden" name="id" value="${id}">
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

exports.create = (request,response) => {
    db.query(`SELECT * FROM author`, (err2, author) => {
        db.query(`SELECT * FROM topic`, (err, result) => {
          let title = `Create`;
          let list = template.list(result);
          let authors = template.authorSelect(author);
          let html = template.HTML(title, list,`
              <form action="/create_process" method="post">
                <p><input type="text" name="title" placeholder="title"></p>
                <p>
                  ${authors}
                </p>
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
        })
      });
}

exports.createProcess = (request,response) => {
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
          [post.title, post.description, post.author_id],
          (err, result) => {
            if(err) throw err;
            response.writeHead(302, {Location: `/?id=${result.insertId}`});
            response.end();
          }
        )
    });
}

exports.update = (request,response,id) => {
    console.log(`update URL로 들어갑니다`)
    db.query(`SELECT * FROM author`, (err3, author) => {
      db.query(`SELECT * FROM topic`,(err, topic) => {
          if (err) throw err;
          db.query(`
            SELECT id, title, description, created, author_id
            FROM topic WHERE id=?`,
            [id],
            (err2,topicSelected) => {
              if(err2) throw err2;
              let id = topicSelected[0].id;
              let title = topicSelected[0].title;
              let pre_author = topicSelected[0].author_id;
              let authorlist = template.authorSelect(author, pre_author);
              let list = template.list(topic);
              let description = topicSelected[0].description;
              let html = template.HTML(title, list,
                `
                <form action="/update_process" method="post">
                  <input type="hidden" name="id" value="${id}">
                  <p><input type="text" name="title" placeholder="title" value="${title}"></p>
                  <p>
                    ${authorlist}
                  </p>
                  <p>
                    <textarea name="description" placeholder="description">${description}</textarea>
                  </p>
                  <p>
                    <input type="submit" value = "제출할수없어넌절대로">
                  </p>
                </form>
                `,
                `<a href="/create">create</a> <a href="/update?id=${id}">update</a>`)
              response.writeHead(200);
              response.end(html);
            })
      })
    })
}

exports.updateProcess = (request,response) => {
    
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
        SET title=?, description=?, author_id=? WHERE id=?`,
        [post.title, post.description, post.author_id, post.id],
        (err, result) => {
          if(err) throw err;
          response.writeHead(302, {Location: `/?id=${post.id}`});
          response.end();
        }
      )
    });

}

exports.deleteProcess = (request,response) => {
    let body = '';
    request.on('data', function(data){
        body = body + data;
    });
    request.on('end', function(){
        let post = qs.parse(body);
        console.log(`post 타입으로 들어온 데이터는 ${JSON.stringify(post)}입니다.`);
        db.query(`DELETE FROM topic WHERE id=?`,[post.id],(err, result) => {
          response.writeHead(302, {Location: `/`});
          response.end();
        })
    });
}