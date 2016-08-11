import fs   from 'fs';
import mime from 'mime';

class File {
  constructor(client, location, options) {
    this._client = client;
    options = options || {};
    this._chunkSize = options.chunkSize || 1024*1024;

    if (options.mimeType) {
      this.initializeBinary(location, options.mimeType);
    } else if (location.startsWith("http://") || location.startsWith("https://")) {
      this.initializeUrl(location);
    } else {
      this.initializePath(location)
    }
  }

  initializeBinary(data, mimeType) {
    if (data.length > this.chunkSize) {
      return initializeDocument(data, mimeType);
    }

    this.header = `Content-Type: ${mimeType}`;
    this.body   = data;
  }

  initializeUrl(url) {
    this.header = `Content-Location: ${url}`;
    this.body   = null;
  }

  initializePath(path) {
    let data = fs.readSync(path);
    let mimeType = mime.lookup(path);

    initializeBinary(data, mimeType);
  }

  initializeDocument(data, mimeType) {
    this._client.documents.create('test.pdf', data.length)
      .then(document => {
        this._upload(0, document, data);
      });
  }

  _upload(cursor, document, data) {
    if (cursor >= data.length) { return };
    let chunk = data.slice(cursor, cursor+this.chunkSize).toString('ASCII');
    let nextCursor = cursor+chunk.length;

    interfax.documents.upload(document.id, cursor, nextCursor-1, chunk)
      .then(() => { this._upload(nextCursor, document, data); });
  }
}

export default File;