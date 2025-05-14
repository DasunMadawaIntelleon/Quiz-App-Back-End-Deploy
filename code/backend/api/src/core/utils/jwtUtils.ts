import jwt from "jsonwebtoken";
import { JwtPayload } from "jsonwebtoken";
import { createError, HttpStatus } from "../middlewares/customErrorHandler";
import logger from "./logger";
import userRepository from "../modules/user/userRepository";
import  {createPrismaClient}  from '../database/prisma';
const prismaInstance = createPrismaClient();

const ACCESS_TOKEN_SECRET = process.env.JWT_SECRET_KEY || 'u606aDawnmeMVMgxesY2Dvf55DXrqtl3';
const REFRESH_TOKEN_SECRET = process.env.REFRESH_TOKEN_SECRET || 'u606aDawnmeMVMgxesY2Dvf55DXrqtl3';
const TOKEN_EXPIRATION = process.env.TOKEN_EXPIRATION ||"1d";
const REFRESH_EXPIRATION = process.env.REFRESH_EXPIRATION ||"7d";

interface CustomJwtPayload extends JwtPayload {
    username: string;
    role?: string;
  }

export const generateAccessToken = (payload: object) => {
  return jwt.sign(payload, ACCESS_TOKEN_SECRET, { expiresIn: TOKEN_EXPIRATION });
};

export const generateRefreshToken = (payload: object) => {
  return jwt.sign(payload, REFRESH_TOKEN_SECRET, { expiresIn: REFRESH_EXPIRATION });
};

export const verifyAccessToken = (token: string) => {
  return jwt.verify(token, ACCESS_TOKEN_SECRET);
};

export const verifyRefreshToken = (token: string) => {
  try {
  
    const payload = jwt.verify(token, REFRESH_TOKEN_SECRET);

    if (typeof payload !== "object" || payload === null || !("username" in payload)) {
      logger.error(`Invalid token payload`);
      throw createError(HttpStatus.BAD_REQUEST, "Invalid token payload");
    } 
    checkUser(payload);
    return payload as CustomJwtPayload;
  } catch (err) {
    logger.error(`Invalid or expired refresh token`, err);
    throw createError(HttpStatus.BAD_REQUEST, "Invalid or expired refresh token");
  }
};

const checkUser = async (payload:any)=>{
  const user = await userRepository.getUserByUsername(prismaInstance,payload.username);
  if (!user) {
    logger.error(`token provide User not found at database: ${payload.username}`);
    throw createError(HttpStatus.UNAUTHORIZED, "Unauthorized, invalid refresh token");
  }
}