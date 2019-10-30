import 'app-module-path/register';
import 'source-map-support/register';

import * as bodyParser from 'body-parser';
import * as timeout from 'connect-timeout';
import * as express from 'express';
import * as logger from 'morgan';

import * as db from './db';
import { allowCors } from './middlewares/allowCors';
import { bindUser } from './middlewares/bindUser';
import * as errors from './middlewares/errors';
import { router as modulesRouter } from './modules/router';
import { exception } from './services/log';
import * as settings from './settings';

const app = express();
app.disable('etag');

if (settings.IS_PROD) {
  app.use(timeout('5s'));
}

app.use(allowCors);
app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bindUser);
app.use(logger('dev'));

app.use('/api', modulesRouter);

app.use(errors.notFound);
app.use(errors.parser);

app.use(
  settings.IS_DEV ?
    errors.developmentError :
    errors.productionError
);

const startServer = db.connectAndMigrate().then(connection => {
  const server = app.listen(settings.PORT, () => console.log(`server started: PORT: ${settings.PORT} | ENV: ${settings.ENV}`));
  return { connection, server };
}).catch(err => {
  exception(err);
  throw err;
});

process.on('unhandledRejection', (reason: any, p: any) => {
  console.error('unhandledRejection');
  console.error(reason);
  console.error(p);
});

process.on('SIGTERM', async () => {
  const { connection, server } = await startServer;

  await new Promise(resolve => {
    setTimeout(() => resolve(), settings.IS_DEV ? 3000 : 10000);

    console.error('SIGMTERM - fechando servidor');
    new Promise(resolve => server.close(() => resolve()))
      .then(() => {
        console.error('SIGMTERM - servidor fechado');
        console.error('SIGMTERM - mongoose disconect');
        return connection.destroy();
      }).then(() => {
        console.error('SIGMTERM - mongoose disconect success');
        console.error('SIGMTERM - finalizando processo');
        resolve();
      }).catch(err => {
        console.error(err);
        resolve();
      });
  });

  process.exit(0);
});