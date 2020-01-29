const { Server } = require('http');
const { app } = require('./handlers');

const main = (port = 4000) => {
  const server = new Server(app.serve.bind(app));
  server.listen(port, () => console.log('started listening', server.address()));
};

main(process.argv[2]);
