const { Server } = require('http');
const { app } = require('./lib/handlers');
const defaultPort = 4000;

const main = cmdLineArgs => {
  let [, , port] = [...cmdLineArgs];
  port = port || defaultPort;
  const server = new Server(app.serve.bind(app));
  server.listen(port, () => console.log('started listening', server.address()));
};

main(process.argv);
