const { readFileSync, existsSync, statSync, writeFileSync } = require('fs');
const CONTENT_TYPES = require('./lib/mimeTypes');
const STATIC_FOLDER = `${__dirname}/public`;
const { loadTemplate } = require('./lib/viewTemplate');

const isFileExists = path => {
  return existsSync(path) && statSync(path);
};

const pageNotFound = (request, response) => {
  response.writeHead(404);
  response.end('Page Not Found');
};

const serveStaticFile = (request, response) => {
  const path = `${STATIC_FOLDER}${request.url}`;
  const extension = path.split('.').pop();
  if (!isFileExists(path)) return pageNotFound(request, response);
  const content = readFileSync(path);
  response.setHeader('Content-Type', CONTENT_TYPES[extension]);
  response.end(content);
};

const createRow = (commentRows, line) => {
  const {date, name,comment} = line;
  const html = `
  <tr>
    <td>${new Date(date).toGMTString()}</td>
    <td>${name}</td>
    <td>${comment}</td>
  </tr>`;
  return commentRows + html;
};

const getComments = () => {
  if (!existsSync('./comments.json')) return [];
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

const readParams = keyValueTextPairs => keyValueTextPairs.split('&').reduce(pickupParams, {});

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
  let body = '';
  const comments = getComments();
  request.setEncoding('utf8');
  request.on('data', data => (body += data));
  request.on('end', () => {
    const { date, name, comment } = createCommentObject(body);
    if (name !== '' && comment !== '') comments.unshift({ date, name, comment });
    writeFileSync('./comments.json', JSON.stringify(comments));
    response.setHeader('location', '/guestBook.html');
    response.writeHead(303);
    response.end();
  });
};

const serveHomePage = (request, response) => {
  request.url = '/index.html';
  return serveStaticFile(request, response);
};

const findHandler = req => {
  if (req.method === 'GET' && req.url === '/') return serveHomePage;
  if (req.method === 'GET' && req.url === '/guestBook.html') return serveGuestPage;
  if (req.method === 'POST' && req.url === '/saveComment') return saveCommentAndRedirect;
  if (req.method === 'GET') return serveStaticFile;
  return pageNotFound;
};

module.exports = { findHandler };
