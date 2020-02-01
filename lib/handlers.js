const { readFileSync, existsSync, statSync, writeFileSync } = require('fs');
const querystring = require('querystring');

const CONTENT_TYPES = require('./mimeTypes');
const { loadTemplate } = require('./viewTemplate');
const { App } = require('./app');
const { COMMENTS_PATH } = require('../config');

const STATIC_FOLDER = `${__dirname}/../public`;
const redirectStatusCode = 303;
const notFoundStatusCode = 404;
const methodNotAllowedStatusCode = 405;

const isFileExists = path => {
  return existsSync(path) && statSync(path);
};

const pageNotFound = (request, response) => {
  response.writeHead(notFoundStatusCode);
  response.end('Page Not Found');
};

const serveStaticFile = (request, response, next) => {
  const url = request.url === '/' ? '/index.html' : request.url;
  const path = `${STATIC_FOLDER}${url}`;
  const extension = path.split('.').pop();
  if (!isFileExists(path)) {
    next();
    return;
  }
  const content = readFileSync(path);
  response.setHeader('Content-Type', CONTENT_TYPES[extension]);
  response.end(content);
};

const createRow = (commentRows, line) => {
  const { date, name, comment } = line;
  const html = `
  <tr>
    <td>${new Date(date).toGMTString()}</td>
    <td>${name}</td>
    <td>${comment}</td>
  </tr>`;
  return commentRows + html;
};

const getComments = path => {
  if (!existsSync(path)) {
    return [];
  }
  return JSON.parse(readFileSync(path, 'utf8') || '[]');
};

const serveGuestPage = (request, response) => {
  const comments = getComments(COMMENTS_PATH);
  const commentRows = comments.reduce(createRow, '');
  const content = loadTemplate('guestBook.html', { COMMENTS: commentRows });
  response.setHeader('Content-Type', CONTENT_TYPES.html);
  response.end(content);
};

const saveCommentAndRedirect = (request, response) => {
  const comments = getComments(COMMENTS_PATH);
  const { name, comment } = request.body;
  comments.unshift({ date: new Date(), name, comment });
  writeFileSync(COMMENTS_PATH, JSON.stringify(comments));
  response.setHeader('location', 'guestBook.html');
  response.writeHead(redirectStatusCode);
  response.end();
};

const readBody = (request, response, next) => {
  const contentType = request.headers['content-type'];
  let body = '';
  request.on('data', data => {
    body += data;
    return body;
  });
  request.on('end', () => {
    request.body = body;
    if (contentType === 'application/x-www-form-urlencoded') {
      request.body = querystring.parse(request.body);
    }
    next();
  });
};

const methodNotAllowed = (request, response) => {
  response.writeHead(methodNotAllowedStatusCode);
  response.end();
};

const app = new App();

app.get('guestBook.html', serveGuestPage);
app.get('', serveStaticFile);
app.get('', pageNotFound);

app.use(readBody);

app.post('saveComment', saveCommentAndRedirect);
app.post('', pageNotFound);

app.use(methodNotAllowed);

module.exports = { app };
