const request = require('supertest');
const { app } = require('../lib/handlers');

describe('GET html pages', function() {
  it('should get homepage /', function(done) {
    request(app.serve.bind(app))
      .get('/')
      .set('Accept', '*/*')
      .expect(200)
      .expect('Content-Type', 'text/html')
      .expect('Content-Length', '792', done);
  });
  it('should get index.html page', function(done) {
    request(app.serve.bind(app))
      .get('/index.html')
      .set('Accept', '*/*')
      .expect(200)
      .expect('Content-Type', 'text/html')
      .expect('Content-Length', '792', done);
  });
  it('should get abeliophyllum.html page', function(done) {
    request(app.serve.bind(app))
      .get('/abeliophyllum.html')
      .set('Accept', '*/*')
      .expect(200)
      .expect('Content-Type', 'text/html')
      .expect('Content-Length', '1534', done);
  });
  it('should get ageratum.html page', function(done) {
    request(app.serve.bind(app))
      .get('/ageratum.html')
      .set('Accept', '*/*')
      .expect(200)
      .expect('Content-Type', 'text/html')
      .expect('Content-Length', '1217', done);
  });
});

describe('GET javascript files', function() {
  it('should get hideJar.js script', function(done) {
    request(app.serve.bind(app))
      .get('/scripts/hideJar.js')
      .set('Accept', '*/*')
      .expect(200)
      .expect('Content-Type', 'application/javascript')
      .expect('Content-Length', '235', done);
  });
});

describe('GET css files', function() {
  it('should get index.css script', function(done) {
    request(app.serve.bind(app))
      .get('/styles/index.css')
      .set('Accept', '*/*')
      .expect(200)
      .expect('Content-Type', 'text/css')
      .expect('Content-Length', '324', done);
  });
  it('should get flowerPages.css script', function(done) {
    request(app.serve.bind(app))
      .get('/styles/flowerPages.css')
      .set('Accept', '*/*')
      .expect(200)
      .expect('Content-Type', 'text/css')
      .expect('Content-Length', '321', done);
  });
  it('should get guestBook.css script', function(done) {
    request(app.serve.bind(app))
      .get('/styles/guestBook.css')
      .set('Accept', '*/*')
      .expect(200)
      .expect('Content-Type', 'text/css')
      .expect('Content-Length', '567', done);
  });
});

describe('GET nonExisting url', function() {
  it('should return 404 for non existing url', function(done) {
    request(app.serve.bind(app))
      .get('/badPage')
      .set('Accept', '*/*')
      .expect(404, done);
  });
});

describe('POST comments', () => {
  it('should post on the saveComment url', function(done) {
    request(app.serve.bind(app))
      .post('/saveComment')
      .send('name=santhosh&comment=nice')
      .expect(303, done);
  });
});
