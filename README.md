# A Static Http Server

[![js-standard-style](https://img.shields.io/badge/code_style-standard-brightgreen.svg)](https://github.com/feross/standard)
[![ci](https://github.com/funnyzak/http-static-server/actions/workflows/ci.yml/badge.svg)](https://github.com/funnyzak/http-static-server/actions/workflows/ci.yml)

## Getting Started

1. With [npm](http://npmjs.org), run `npm install @funnyzak/http-server`
2. `const StaticHttpServer = require('@funnyzak/http-server')`

## Usage

Here is an example that:

1. create a new server instance
2. start server.

```js
const StaticHttpServer = require('@funnyzak/http-server')
const server = new StaticHttpServer({
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
})

server.serve();

```
