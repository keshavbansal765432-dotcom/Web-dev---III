// Basic HTTP server with three routes.
const http = require('http');

const PORT = 3000;

const pages = {
  '/': 'Welcome to the Node.js server',
  '/about': 'This is the About page',
  '/contact': 'This is the Contact page'
};

const server = http.createServer((request, response) => {
  console.log(`${request.method} ${request.url}`);
  response.setHeader('Content-Type', 'text/plain');

  if (request.method === 'GET' && pages[request.url]) {
    response.writeHead(200);
    response.end(pages[request.url]);
    return;
  }

  response.writeHead(404);
  response.end('404 - Page Not Found');
});

server.listen(PORT, () => {
  console.log(`Server started at http://localhost:${PORT}`);
});
