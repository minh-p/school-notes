import dotenv from 'dotenv';
import express, { Express } from 'express';
import path from 'path';
import liveReload from 'livereload';
import connectLiveReload from 'connect-livereload';
import logger from 'morgan';

import indexRouter from './routes/indexRouter';
import notesRouter from './routes/notesRouter';

dotenv.config();
const port = process.env.PORT;

const app: Express = express();

if (process.env.NODE_ENV === 'development') {
  const liveReloadServer = liveReload.createServer();
  liveReloadServer.watch(path.join(__dirname, 'public'));
  liveReloadServer.server.once('connection', () => {
    setTimeout(() => {
      liveReloadServer.refresh("/");
    }, 100);
  });
  app.use(connectLiveReload());
  app.use(logger('dev'));
}

app.set('view engine', 'pug');
app.set('views', path.join(__dirname, "views"));
app.use(express.static(path.join(__dirname, 'public')));
app.use('/', indexRouter);
app.use('/notes', notesRouter);

app.listen(port, () => {
  console.log(`[server]: Server is running at https://localhost:${port}`);
})
