const request = require('supertest');
const { app } = require('../lib/handlers');

describe('GET home page', function() {
  it('should get homepage / path', function(done) {
    request(app.serve.bind(app))
      .get('/')
      .set('Accept', '*/*')
      .expect(200)
      .expect('Content-Type', 'text/html')
      .expect('Content-Length', '792', done);
  });
});

describe('GET index page', function() {
  it('should get ./public/index.html path', function(done) {
    request(app.serve.bind(app))
      .get('/index.html')
      .set('Accept', '*/*')
      .expect(200)
      .expect('Content-Type', 'text/html')
      .expect('Content-Length', '792', done);
  });
});

describe('GET abeliophyllum page', function() {
  it('should get ./public/abeliophyllum.html path', function(done) {
    request(app.serve.bind(app))
      .get('/abeliophyllum.html')
      .set('Accept', '*/*')
      .expect(200)
      .expect('Content-Type', 'text/html')
      .expect('Content-Length', '1534', done);
  });
});

describe('GET ageratum page', function() {
  it('should get ./public/ageratum.html path', function(done) {
    request(app.serve.bind(app))
      .get('/ageratum.html')
      .set('Accept', '*/*')
      .expect(200)
      .expect('Content-Type', 'text/html')
      .expect('Content-Length', '1217', done);
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
  it('should post on the register url', function(done) {
    request(app.serve.bind(app))
      .post('/saveComment')
      .send('name=santhosh&comment=nice')
      .expect(303, done);
  });
});
