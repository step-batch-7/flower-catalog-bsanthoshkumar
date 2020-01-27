class Response {
  constructor() {
    this.statusCode = 404;
    this.headers = [];
    this.body = '';
  }

  setHeader(key, value) {
    this.headers.push({ key, value });
  }

  setContentLength() {
    this.headers.push({ key: 'Content-Length', value: this.body.length });
  }

  generateHeadersText() {
    const lines = this.headers.map(header => `${header.key}: ${header.value}`);
    return lines.join('\r\n');
  }

  writeTo(writable) {
    writable.write(`HTTP/1.1 ${this.statusCode}\r\n`);
    writable.write(this.generateHeadersText());
    writable.write('\r\n\r\n');
    this.body && writable.write(this.body);
  }
}
module.exports = Response;
