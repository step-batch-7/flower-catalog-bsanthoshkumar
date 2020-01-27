const { readFileSync, existsSync, statSync } = require('fs');
const Response = require('./lib/response');
const CONTENT_TYPES = require('./lib/mimeTypes');
const STATIC_FOLDER = `${__dirname}/public`;
const { loadTemplate } = require('./lib/viewTemplate');

const isFileExists = path => {
  return existsSync(path) && statSync(path);
};

const serveStaticFile = req => {
  const path = `${STATIC_FOLDER}${req.url}`;
  if (!isFileExists(path)) return new Response();
  const extension = path.split('.').pop();
  const response = new Response();
  response.statusCode = 200;
  response.body = readFileSync(path);
  response.setHeader('Content-Type', CONTENT_TYPES[extension]);
  response.setContentLength();
  return response;
};

const serveHomePage = req => {
  req.url = '/index.html';
  return serveStaticFile(req);
};

const createRow = line => {
  return `
  <tr>
  <td>${line.date}</td>
  <td>${line.name}</td>
  <td>${line.comment}</td>
</tr>`;
};

const getComments = () => {
  const commentsList = JSON.parse(readFileSync('./comments.json'));
  return commentsList.reduce(createRow, '');
};

const serveGuestPage = req => {
  const comments = getComments();
  const response = new Response();
  response.statusCode = 200;
  response.body = loadTemplate('guestBook.html', { COMMENTS: comments });
  response.setHeader('Content-Type', CONTENT_TYPES.html);
  response.setContentLength();
  return response;
};

const findHandler = req => {
  if (req.method === 'GET' && req.url === '/') return serveHomePage;
  if (req.method === 'GET' && req.url === '/guestBook.html') return serveGuestPage;
  if (req.method === 'POST' && req.url === 'saveComment') return saveComment;
  if (req.method === 'GET') return serveStaticFile;
  return () => new Response();
};

const processRequest = req => {
  const handler = findHandler(req);
  return handler(req);
};

module.exports = { processRequest };
