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
