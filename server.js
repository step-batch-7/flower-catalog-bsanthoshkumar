const { Server } = require('http');
const { findHandler } = require('./app');

const requestListener = (request, response) => {
  console.log(request.url, request.method);
  const handler = findHandler(request);
  return handler(request, response);
};

const main = (port = 4000) => {
  const server = new Server(requestListener);
  server.listen(port, () => console.log('started listening', server.address()));
};

main(process.argv[2]);
