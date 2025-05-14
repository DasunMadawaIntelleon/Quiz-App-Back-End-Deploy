import * as jwtUtils from "../../utils/jwtUtils";
import bcrypt from 'bcrypt';
import userRepository from '../user/userRepository';
import { Response } from "express";
import  {createPrismaClient}  from '../../database/prisma';
import logger from '../../utils/logger';

const authService = {
  
  signIn : async (username: string, password: string, res: Response ) => {
    try {
      logger.info(`Attempting to sign in user: ${username}`);

    const user = await userRepository.getUserByUsername(createPrismaClient(),username);
    if (!user) {
      logger.warn(`Sign-in failed: User not found for username: ${username}`);
      throw new Error('User not found');
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      logger.warn(`Sign-in failed: Invalid password for username: ${username}`);
      throw new Error('Invalid password');
    }

    const accessToken = jwtUtils.generateAccessToken({ username: user.user_name, role: user.role });
    const refreshToken = jwtUtils.generateRefreshToken({ username: user.user_name });

    logger.info(`Generated tokens for user: ${username}`);

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000, 
    });
    logger.info(`Refresh token set in cookie for user: ${username}`);
    return { accessToken, user: { username: user.user_name, role: user.role , name:user.name} };
    } catch (error) {
      logger.error(`Sign-in failed for username: ${username}`, { error });
      throw error
    }
  },
  refreshToken : async (token: string) => {
    try {
      logger.info(`Attempting to refresh access token`);

      if (!token) {
        logger.warn(`Refresh token not provided`);
        throw new Error("Refresh token not provided");
      }
      const payload = jwtUtils.verifyRefreshToken(token);
      logger.info(`Access token refreshed for user: ${payload.username}`);
      return jwtUtils.generateAccessToken({ username: payload.username, role: payload.role });
      
    } catch (error) {
      logger.error(`Access token refreshed failed for username: ${token}`, { error });
      throw error
    }
  }
}

export default authService;
