import Koa from 'koa';
import { Server as ServerHttp, createServer } from 'http';
import { Server as ServerHttps, createServer as createServerSsl } from 'https';

import serve from 'koa-static';
import mount from 'koa-mount';
import history from 'ts-koa-connect-history-api-fallback';
import koaProxy from 'koa-proxies';

import fs from 'fs-extra';

import logging from './logging';

import config from './config';

const serverConfig = config.server;

// init logging
const logger = logging.logger('app.ts');

const app = new Koa();

// setup proxy
app.use(koaProxy(serverConfig.proxy.prefix, {
  target: `http://${serverConfig.proxy.host}:${serverConfig.proxy.port}`,
  changeOrigin: true,
  logs: true,
}));

// mount static site with html-5 hitory mode
const staticSite = new Koa();
staticSite
  .use(history())
  .use(serve(serverConfig.public.path));

app.use(mount(serverConfig.public.mount, staticSite));

// HTTP and HTTPS server setup
let server: ServerHttp;
let serverSsl: ServerHttps;

function run() {
  logger.info(`server started with settings ${JSON.stringify(serverConfig)}`);
  server = createServer(app.callback()).listen(serverConfig.port);
  server.requestTimeout = serverConfig.timeout;

  if (serverConfig.ssl) {
    const options = {
      key: fs.readFileSync(serverConfig.ssl.key).toString(),
      cert: fs.readFileSync(serverConfig.ssl.cert).toString(),
    };

    serverSsl = createServerSsl(options, app.callback()).listen(serverConfig.ssl.port);
    serverSsl.requestTimeout = serverConfig.timeout;
  }
}

// server start / stop to support flexible DevOps
function kill() {
  logger.info('stopping...');
  server.close();
  serverSsl.close();
}

export default {
  run,
  kill,
};
