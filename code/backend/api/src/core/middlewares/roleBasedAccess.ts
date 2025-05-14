import { Request, Response, NextFunction } from "express";
import {
  accessiblePaths,
  Role,
  dirrectAccessRoutes,
} from "../utils/accessiblePaths";
import jwt from "jsonwebtoken";
import logger from "../utils/logger";
import userRepository from "../modules/user/userRepository";
import  {createPrismaClient}  from '../database/prisma';
const prismaInstance = createPrismaClient();


const matchRoute = (routePath: string, requestPath: string): boolean => {
  const routeParts = routePath.split("/");
  const requestParts = requestPath.split("/");

  if (routeParts.length !== requestParts.length) return false;

  return routeParts.every((part, index) => part.startsWith(":") || part === requestParts[index]);
};

const isDirectAccessPath = (requestPath: string, directAccessRoutes: string[]): boolean => {
  return directAccessRoutes.some(route => matchRoute(route, requestPath));
};

const roleBasedAccess = async (req: Request, res: Response, next: NextFunction): Promise<void> => {

  if (isDirectAccessPath(req.path, dirrectAccessRoutes)) {
    return next();
  }

  const authHeader = req.headers["authorization"];
  const token = authHeader?.split(" ")[1];
  if (!token) {
    logger.error(`Unauthorized access no token provide`);
    res.status(401).json({ message: "Unauthorized access no token provide" });
    return;
  }

  jwt.verify(
    token,
    process.env.JWT_SECRET_KEY || "u606aDawnmeMVMgxesY2Dvf55DXrqtl3",
    (err: any, user: any) => {
      if (err) {
        logger.error(`Invalid token`);
        res.status(401).json({ message: "Invalid token" });
        return;
      }
      req.user = user;
    }
  );

  const user = req.user;
  
  if (!user || !user.role) {
    logger.error(`Authentication required`);
    res.status(401).json({ message: "Authentication required" });
    return;
  }

  const existingUser = await userRepository.getUserByUsername(prismaInstance,user.username);
  if (!existingUser) {
    logger.error(`Unauthorized, invalid credentials`);
    res.status(401).json({ message: "Unauthorized, invalid credentials" });
  }

  if (!(user.role in accessiblePaths)) {
    logger.error(`Invalid role`);
    res.status(401).json({ message: "Invalid role" });
    return;
  }

  const allowedPaths = accessiblePaths[user.role as Role] || [];
  const allPaths = Object.values(accessiblePaths).flat(); 

  const pathExists = allPaths.some(route => matchRoute(route.path, req.path));

  if (!pathExists) {
    logger.error(`Route not found`);
    res.status(404).json({ message: "Route not found" });
    return;
  }

  const isAllowed = allowedPaths.some(route => matchRoute(route.path, req.path) && route.method === req.method.toUpperCase());

  if (!isAllowed) {
    logger.error(`Access denied: You do not have permission to access this resource`);
    res.status(403).json({
      message: "Access denied: You do not have permission to access this resource",
    });
    return;
  }

  next();
};

export default roleBasedAccess;
