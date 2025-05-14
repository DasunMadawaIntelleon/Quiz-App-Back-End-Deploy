import dotenv from 'dotenv';
dotenv.config();

import express, { Express } from 'express';
import path from 'path';
import cookieParser from 'cookie-parser';
import cors from 'cors';

import errorHandler from './core/middlewares/errorHandler';
import loadRoutes from './core/middlewares/routeLoader';
import logger from './core/utils/logger';
import expressWinston from 'express-winston';
import roleBasedAccess from './core/middlewares/roleBasedAccess';

const app: Express = express();
app.use(cors());

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use(roleBasedAccess);

const basePath = process.env.API_BASE_PATH || '/quizapp/api/v1';
loadRoutes(app, basePath, path.join(__dirname, 'core/modules'));

app.use(errorHandler);

app.use(
  expressWinston.logger({
    winstonInstance: logger,
    meta: true, 
    msg: "HTTP {{req.method}} {{req.url}}", 
    expressFormat: true, 
    colorize: false, 
    ignoreRoute: function () {
      return false; 
    }
  })
);

app.use(
  expressWinston.errorLogger({
    winstonInstance: logger
  })
);
export default app;
