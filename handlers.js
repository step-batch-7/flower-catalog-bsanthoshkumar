const { readFileSync, existsSync, statSync, writeFileSync } = require('fs');
const CONTENT_TYPES = require('./lib/mimeTypes');
const { loadTemplate } = require('./lib/viewTemplate');
const { App } = require('./app');
const STATIC_FOLDER = `${__dirname}/public`;

const redirectStatusCode = 303;
const notFoundStatusCode = 404;

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

const getComments = () => {
  if (!existsSync('./comments.json')) {
    return [];
  }
  return JSON.parse(readFileSync('./comments.json'));
};

const serveGuestPage = (request, response) => {
  const comments = getComments();
  const commentRows = comments.reduce(createRow, '');
  const content = loadTemplate('guestBook.html', { COMMENTS: commentRows });
  response.setHeader('Content-Type', CONTENT_TYPES.html);
  response.end(content);
};

const pickupParams = (query, keyValue) => {
  const [key, value] = keyValue.split('=');
  query[key] = value;
  return query;
};

const readParams = keyValueTextPairs => {
  return keyValueTextPairs.split('&').reduce(pickupParams, {});
};

const parseBody = body => {
  let { name, comment } = readParams(body);
  comment = decodeURIComponent(comment);
  name = name.replace(/\+/g, ' ');
  comment = comment.replace(/\+/g, ' ');
  return { name, comment };
};

const createCommentObject = body => {
  const { name, comment } = parseBody(body);
  const date = new Date();
  return { date, name, comment };
};

const saveCommentAndRedirect = (request, response) => {
  const comments = getComments();
  const { date, name, comment } = createCommentObject(request.body);
  comments.unshift({ date, name, comment });
  writeFileSync('./comments.json', JSON.stringify(comments));
  response.setHeader('location', 'guestBook.html');
  response.writeHead(redirectStatusCode);
  response.end();
};

const readBody = (request, response, next) => {
  let body = '';
  request.on('data', data => {
    body += data;
    return body;
  });
  request.on('end', () => {
    request.body = body;
    next();
  });
};

const app = new App();

app.use(readBody);
app.get('guestBook.html', serveGuestPage);
app.get('', serveStaticFile);
app.post('saveComment', saveCommentAndRedirect);
app.use(pageNotFound);

module.exports = { app };
