[![js-standard-style](https://img.shields.io/badge/code_style-standard-brightgreen.svg)](https://github.com/feross/standard)
[![npm](https://img.shields.io/npm/v/@funnyzak/http-server.svg?style=flat-square)](https://www.npmjs.com/package/@funnyzak/http-server)
[![license](https://img.shields.io/github/license/funnyzak/static-http-server.svg?style=flat-square)](https://github.com/funnyzak/static-http-server)
# a simple static http server

it is a simple static HTTP server node module.

## Getting Started

1. With [npm](http://npmjs.org), run `npm install @funnyzak/http-server`
2. `const StaticHttpServer = require('@funnyzak/http-server')`

## Usage

Here is an example that:

1. create a new server instance
2. start server.

```js
const StaticHttpServer = require('@funnyzak/http-server')

const rootPath = process.cwd();
const server = new StaticHttpServer({
  host: '127.0.0.1', // host
  port: 16808, // listen port
  root: rootPath, // static root directory
  cors: true, // allow cors
  compress: true, // compress response
  cache: {
    maxAge: 3600,
    expires: true, // is set expires
    cacheControl: true, // is set cacheControl
    lastModified: true,
    etag: true
  },
})

// start server
server.serve();

// close server
setTimeout(server.close, 5000);

// conversion of resource path to virtual path under Root
var virtualUrl = server.parseVirtualPath(resourcePath);

```

## Author

| [![twitter/funnyzak](https://s.gravatar.com/avatar/c2437e240644b1317a4a356c6d6253ee?s=70)](https://twitter.com/funnyzak 'Follow @funnyzak on Twitter') |
| ------------------------------------------------------------------------------------------------------------------------------------------------------ |
| [funnyzak](https://yycc.me/)                                                                                                                           |

## License

Apache-2.0 License © 2021 [funnyzak](https://github.com/funnyzak)
