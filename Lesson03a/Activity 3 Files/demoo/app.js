const http = require('http');


const server = http.createServer((req, res) => {

    let response = `
        <!DOCTYPE html>
        <html>
        <head>
            <title>Welcome</title>
        </head>
        <body>
            <h1>Welcome to my first Node.Js Page ! </h1>
            <p><b>Name</b>: Peter Lim </p>
            <p><b>School</b>: School Of Infocomm</p>
            <p><b>Diploma</b>: Business Systems</p>
        </body>
        </html>
    `;
    res.end(response);
});


const PORT = 3000;

server.listen(PORT, () => {
    console.log(`Server is running at http://localhost:${PORT}/`);
});