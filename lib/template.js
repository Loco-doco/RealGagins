module.exports = {
    HTML:function(title, list, body, control){
        console.log(`template.js / HTML function / title = ${title}`);
        console.log(`template.js / HTML function / list = ${list}`);
        console.log(`template.js / HTML function / body = ${body}`);
        console.log(`template.js / HTML function / control = ${control}`);
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
    },/*list:function(filelist){
      var list = '<ul>';
      var i = 0;
      while(i < filelist.length){
        list = list + `<li><a href="/?id=${filelist[i]}">${filelist[i]}</a></li>`;
        i = i + 1;
      }
      list = list+'</ul>';
      return list;
    }*/
    list:(files) => {
        console.log(`(template.js // files = ${files}`)
        let list = '<ul>';
        files.forEach((file) => {
            list += `<li><a href="/?id=${file}">${file}</a></li>`
        });
        list += '</ul>';
        return list;
    }
}
