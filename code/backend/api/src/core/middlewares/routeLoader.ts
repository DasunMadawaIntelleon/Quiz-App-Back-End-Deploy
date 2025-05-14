import { Application } from 'express';
import fs from 'fs';
import path from 'path';
import logger from '../utils/logger';

/**
 * Dynamically loads and registers all routes from the modules folder.
 *
 * @param app - The Express application instance.
 * @param basePath - The base API path (e.g., '/api/v1').
 * @param modulesPath - The absolute path to the modules directory.
 */
const loadRoutes = (app: Application, basePath: string, modulesPath: string): void => {
  const directories = fs.readdirSync(modulesPath);

  directories.forEach((moduleName) => {
    
    const routePathTs = path.join(modulesPath, moduleName, `${moduleName}Routes.ts`);
    const routePathJs = path.join(modulesPath, moduleName, `${moduleName}Routes.js`);
    const routePath = fs.existsSync(routePathJs) ? routePathJs : fs.existsSync(routePathTs) ? routePathTs : null;

    if (routePath) {
      try {
        const router = require(routePath).default;
        app.use(`${basePath}/${moduleName}`, router);
        logger.info(`Loaded route: ${basePath}/${moduleName}`);
      } catch (error) {
        logger.error(`Failed to load route for module: ${moduleName}`, error);
      }
    } else {
      logger.warn(`No route file found for module: ${moduleName}`);
    }
  });
};

export default loadRoutes;
