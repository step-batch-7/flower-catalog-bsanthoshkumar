const fs = require('fs');
const Response = require('./lib/response');
const CONTENT_TYPES = require('./lib/mimeTypes');
const STATIC_FOLDER = `${__dirname}/public`;

const isFileExists = path => {
  return fs.existsSync(path) && fs.statSync(path);
};

const serveStaticFile = req => {
  const path = `${STATIC_FOLDER}${req.url}`;
  if (!isFileExists(path)) return new Response();
  const extension = path.split('.').pop();
  const response = new Response();
  response.statusCode = 200;
  response.body = fs.readFileSync(path);
  response.setHeader('Content-Type', CONTENT_TYPES[extension]);
  response.setContentLength();
  return response;
};

const serveHomePage = req => {
  req.url = '/index.html';
  return serveStaticFile(req);
};

const findHandler = req => {
  if (req.method === 'GET' && req.url === '/') return serveHomePage;
  if (req.method === 'GET') return serveStaticFile;
  return () => new Response();
};

const processRequest = req => {
  const handler = findHandler(req);
  return handler(req);
};

module.exports = { processRequest };
