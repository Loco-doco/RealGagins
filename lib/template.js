module.exports = {
    HTML:function(title, list, body, control){
      console.log(`template.js 파일의 HTML function에 들어왔습니다`);
        // console.log(`template.js / HTML function / title = ${title}`);
        // console.log(`template.js / HTML function / list = ${list}`);
        // console.log(`template.js / HTML function / body = ${body}`);
        // console.log(`template.js / HTML function / control = ${control}`);
      console.log(`template.js 파일의 HTML function에 따라 HTML파일을 뱉어냅니다.`);
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
        ${control}
        ${body}
      </body>
      </html>
      `;
    },list:(tableData) => {
        console.log(`열심히 파일 이름으로 된 리스트를 만들고 있습니다.`)
        let list = '<ul>';
        tableData.forEach((data) => {
            list += `<li><a href="/?id=${data.id}">${data.title}</a></li>`
        });
        list += '</ul>';
        console.log(`파일 이름으로 된 리스트를 다 만들었습니다`)
        // console.log(`리스트는 이렇게 생겼습니다 => ${list}`)
        console.log(`파일 이름으로 된 리스트를 뱉어냅니다`)
        return list;
    }, authorSelect : (authors, pre_author) => {
      let tag = '';
      authors.forEach(author => {
        let selected = '';
        if(author.id === pre_author){
          selected = ' selected'
        }
        tag += `<option value = ${author.id}${selected}>${author.name}</option>`
      });
      return `
        <select name="author_id">
         ${tag}
        </select>
      `
    }
}
