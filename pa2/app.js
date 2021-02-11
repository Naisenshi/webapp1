const http = require('http');
const fs = require('fs');

const server = http.createServer((req, res) => {
    console.log(req.url);

    res.setHeader('Content-Type' , 'text/html');
    let urll = './views/';

    if(req.url == '/'){
        urll += 'index.html';
        res.statusCode == 200;
    }else if(req.url == '/aboutus'){
        urll += 'aboutus.html';
        res.statusCode == 200;
    }else if(req.url == '/contactus'){
        urll += 'contactus.html';
        res.statusCode == 200;
    }else {
        urll += 'error.html';
        res.statusCode == 404;
    }

    fs.readFile(urll, (err, data) => {
        if (err) {
            console.log(err);
            res.end();
        } else {
            res.end(data);
        }
    });
});

server.listen(8080, "localhost", () => {
    console.log("listening at port 8080");
})