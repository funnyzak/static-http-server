const http = require('http');
const path = require('path');
const util = require('util');
const fs = require('fs');
const chalk = require('chalk');
const mime = require('mime');

const stat = util.promisify(fs.stat);
const readdir = util.promisify(fs.readdir);

const warning = (message) => chalk`{yellow WARNING:} ${message}`;
const info = (message) => chalk`{magenta INFO:} ${message}`;
const error = (message) => chalk`{red ERROR:} ${message}`;

const registerShutdown = (fn) => {
  let run = false;

  const wrapper = () => {
    if (!run) {
      run = true;
      fn();
    }
  };

  process.on('SIGINT', wrapper);
  process.on('SIGTERM', wrapper);
  process.on('exit', wrapper);
};

/**
 * 静态服务器
 */
class StaticHttpServer {
  constructor(conf = {}) {
    this.config = {
      host: '127.0.0.1',
      port: 16808,
      root: process.cwd(),
      cors: true,
      compress: true,
      cache: {
        maxAge: 3600,
        expires: true,
        cacheControl: true,
        lastModified: true,
        etag: true
      },
      ...conf
    };

    this.parseVirtualPath = this.parseVirtualPath.bind(this);
    this.getMime = this.getMime.bind(this);
    this.dispose = this.dispose.bind(this);
    this.serve = this.serve.bind(this);
    this.handler = this.handler.bind(this);
    this.cache = this.cache.bind(this);
    this.setCache = this.setCache.bind(this);
    this.log = this.log.bind(this);
  }

  /**
   * Conversion of resource path to virtual path under Root
   * @param {*} filePath
   * @param {*} withHost with host:port prefix
   * @returns
   */
  parseVirtualPath(filePath, withHost = false) {
    let virtualPath = !filePath || filePath === null
      ? ''
      : filePath.replace(this.config.root, '').replace(path.sep, '/');
    this.log('get static url:', filePath, virtualPath);
    if (virtualPath === '') return virtualPath;

    virtualPath = virtualPath.startsWith('/') ? virtualPath : `/${virtualPath}`;
    return `${withHost ? `http://${this.config.host}:${this.config.port}` : ''
      }${virtualPath}`;
  }

  serve() {
    this.server = http.createServer(
      {
        maxHeaderSize: 81920
      },
      this.handler
    );

    this.server.listen(this.config.port, this.config.host, () => {
      const addr = `http://${this.config.host}:${this.config.port}`;
      console.log(info(`server http://{this.config.host}:${this.config.port} is started.`));
    });

    this.server.on('close', () => {
      console.log(info(`server http://{this.config.host}:${this.config.port} is closed.`));
    });

    registerShutdown(() => this.server.close());
  }

  dispose() {
    if (!this.server) return;
    this.server.close((err) => {
      if (err) throw err;
      console.log(info(`server http://{this.config.host}:${this.config.port} is closed.`));
    });
  }

  async handler(req, res) {
    const resPath = path.join(this.config.root, req.url.replace('/', path.sep));
    console.log(info(`request url: ${chalk.blue(req.url)}, request header: ${chalk.green(JSON.stringify(req.headers))}`));

    if (this.config.cors) {
      res.setHeader('Access-Control-Allow-Origin', '*');
    }

    try {
      const stats = await stat(resPath);
      if (stats.isFile()) {
        res.statusCode = 200;
        res.setHeader('content-type', this.getMime(resPath));

        if (this.cache(req, res, stats)) {
          res.statusCode = 304;
          res.end();
          return;
        }
        fs.createReadStream(resPath).pipe(res);
      } else if (stats.isDirectory()) {
        const files = await readdir(resPath);
        res.statusCode = 200;
        res.setHeader('content-type', 'text/html');
        res.end(files.join(' '));
      }
    } catch (err) {
      this.log('error', 'handler', err);
      res.statusCode = 404;
      res.setHeader('content-type', 'text/plain');
      const errMessage = process.env.NODE_ENV === 'development'
        ? `request ${req.url} error, message: ${err.message}`
        : `request ${req.url} fail.`;

      console.error(error(err.message));
      res.end(errMessage);
    }
  }

  getMime(resPath) {
    const mimeTypes = {
      default: 'text/plain',
      jpg: 'image/jpeg',
      jpeg: 'image/jpeg',
      png: 'image/png'
    };

    let ext = path.extname(resPath).split('.').pop().toLowerCase();
    if (!ext) {
      ext = resPath;
    }
    return mimeTypes[ext] || mime.getType(ext) || mimeTypes.default;
  }

  cache(req, res, fileStats) {
    this.setCache(res, fileStats);

    const lastModified = req.headers['if-modified-since'];
    const etag = req.headers['if-none-match'];

    if (!lastModified && !etag) {
      return false;
    }
    if (lastModified && lastModified !== res.getHeader('Last-Modified')) {
      return false;
    }
    if (etag && etag !== res.getHeader('ETag')) {
      return false;
    }
    return true;
  }

  setCache(res, fileStats) {
    const {
      maxAge, expires, cacheControl, lastModified, etag
    } = this.config.cache;
    if (expires) {
      res.setHeader(
        'Expires',
        new Date(Date.now() + maxAge * 1000).toUTCString()
      );
    }
    if (cacheControl) {
      res.setHeader('Cache-Control', `public, max-age=${maxAge}`);
    }
    if (lastModified) {
      res.setHeader('Last-Modified', fileStats.mtime.toUTCString());
    }
    if (etag) {
      res.setHeader(
        'ETag',
        `${fileStats.size}-${fileStats.mtime.toUTCString()}`
      );
    }
  }

  log(level = 'info', ...args) {
    switch (level) {
      case 'warn':
        console.warn(args);
        break;
      case 'error':
        console.error(args);
        break;
      case 'info':
        console.info(args);
        break;
      default:
        console.info(level, args);
        break;
    }
  }
}

module.exports = StaticHttpServer
