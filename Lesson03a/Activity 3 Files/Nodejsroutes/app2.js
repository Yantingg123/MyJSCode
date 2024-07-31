const http = require('http');
 
 
const server = http.createServer((req, res) => {
  // Different routes
 
  if (req.url === '/') {
      res.writeHead(200, { 'Content-Type': 'text/html' });
      res.write('Home page')
      res.end();
    } else if (req.url === '/about') {
      res.writeHead(200, { 'Content-Type': 'text/html' });
      res.write('About us page');
      res.end();
    } else if (req.url === '/contact') {
      res.writeHead(200, { 'Content-Type': 'text/html' });
      res.write('Contact page');
      res.end();
    } else {
      res.writeHead(404, { 'Content-type' : 'text/html' });
      res.end('404 Not Found');
    }
});
 
 
const PORT = 3000;
server.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}/`);
});