// Type definitions for [~THE LIBRARY NAME~] [~OPTIONAL VERSION NUMBER~]
// Project: [~THE PROJECT NAME~]
// Definitions by: [~YOUR NAME~] <[~A URL FOR YOU~]>

/*~ This is the module template file for class modules.
 *~ You should rename it to index.d.ts and place it in a folder with the same name as the module.
 *~ For example, if you were writing a file for "super-greeter", this
 *~ file should be 'super-greeter/index.d.ts'
 */

/*~ Note that ES6 modules cannot directly export class objects.
 *~ This file should be imported using the CommonJS-style:
 *~   import x = require('someLibrary');
 *~
 *~ Refer to the documentation to understand common
 *~ workarounds for this limitation of ES6 modules.
 */

/*~ This declaration specifies that the class constructor function
 *~ is the exported object from the file
 */
export = StaticHttpServer;

import http = require('http');

/*~ Write your module's methods and properties in this class */
declare class StaticHttpServer {
  constructor(config: StaticHttpServer.Config);
  /**
   * Conversion of resource path to virtual path under Root
   * @param {*} filePath
   * @param {*} withHost with host:port prefix
   * @returns
   */
  parseVirtualPath(filePath: any, withHost?: any): any;
  getMime(resPath: any): any;
  dispose(): void;
  serve(): void;
  handler(req: any, res: any): Promise<void>;
  cache(req: any, res: any, fileStats: any): boolean;
  setCache(res: any, fileStats: any): void;
  log(level?: string, ...args: any[]): void;
  server: http.Server | undefined;
}

/*~ If you want to expose types from your module as well, you can
 *~ place them in this block.
 */
declare namespace StaticHttpServer {
  export interface Config {
    host: string;
    port: number;
    root: string;
    cors?: true;
    compress?: true;
    cache?: CacheConfig;
  }

  export interface CacheConfig {
    maxAge?: number;
    expires?: boolean;
    cacheControl?: boolean;
    lastModified?: boolean;
    etag?: boolean;
  }
}
