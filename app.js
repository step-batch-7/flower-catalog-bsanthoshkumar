const { readFileSync, existsSync, statSync, writeFileSync } = require('fs');
const Response = require('./lib/response');
const CONTENT_TYPES = require('./lib/mimeTypes');
const { loadTemplate } = require('./lib/viewTemplate');
const STATIC_FOLDER = `${__dirname}/public`;

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

const createRow = (commentRows, line) => {
  return (
    commentRows +
    `
  <tr>
  <td>${line.date}</td>
  <td>${line.name}</td>
  <td>${line.comment}</td>
</tr>`
  );
};

const getComments = () => {
  if (!existsSync('./comments.json')) return [];
  return JSON.parse(readFileSync('./comments.json'));
};

const serveGuestPage = req => {
  const comments = getComments();
  const commentRows = comments.reduce(createRow, '');
  const response = new Response();
  response.statusCode = 200;
  response.body = loadTemplate('guestBook.html', { COMMENTS: commentRows });
  response.setHeader('Content-Type', CONTENT_TYPES.html);
  response.setContentLength();
  return response;
};

const createCommentObject = body => {
  const { name, comment } = body;
  const date = new Date();
  return { date, name, comment };
};

const saveCommentAndRedirect = req => {
  const comments = getComments();
  const {name ,comment} = req.body;
  if(name != "" && comment != "") {
    comments.unshift(createCommentObject(req.body));
  }
  writeFileSync('./comments.json', JSON.stringify(comments));
  const response = new Response();
  response.setHeader ('location','/guestBook.html');
  response.statusCode = 303;
  return response;
};

const findHandler = req => {
  if (req.method === 'GET' && req.url === '/guestBook.html') return serveGuestPage;
  if (req.method === 'POST' && req.url === '/saveComment') return saveCommentAndRedirect;
  if (req.method === 'GET') return serveStaticFile;
  return () => new Response();
};

const processRequest = req => {
  const handler = findHandler(req);
  return handler(req);
};

module.exports = { processRequest };
