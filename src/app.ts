import http, { IncomingMessage, ServerResponse } from 'http';

const server = http.createServer((req: IncomingMessage, res: ServerResponse) => {
  res.writeHead(200, {
    'Content-Type': 'text/html; charset=utf8',
  });
  // в методе end тоже можно передать данные
  res.end('<h1>Привет, мир!</h1>', 'utf8');
});

server.listen(3000);
