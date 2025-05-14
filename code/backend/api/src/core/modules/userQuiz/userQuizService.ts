import userQuizRepository from './userQuizRepository';
import  {createPrismaClient}  from '../../database/prisma';
import userQuizQuestionRepository from '../userQuizQuestion/userQuizQuestionRepository';
import quizRepository from '../quiz/quizRepository';
import userRepository from '../user/userRepository';
import { createError, HttpStatus } from '../../middlewares/customErrorHandler';
import logger from '../../utils/logger';
const prismaInstance = createPrismaClient();

const userQuizService = {

  getUserQuizesByQuizID:  async (id: string) => {
    logger.info(`Fetching user quizzes by quiz ID: ${id}`);
   try{
      const quizExists = await quizRepository.getOnlyQuizById(prismaInstance,id);
      if (!quizExists) {
          logger.warn(`Quiz not found: ${id}`);
          throw createError(HttpStatus.NOT_FOUND, "Quiz not found");
      }

      const userQuizes = await userQuizRepository.getUserQuizesByQuizId(prismaInstance,id);
      if (!userQuizes || userQuizes.length === 0) {
        logger.warn(`No quizzes found for quiz ID: ${id}`);
        return [];
      }
      logger.info(`Fetched ${userQuizes.length} quizzes for quiz ID: ${id}`);
      return userQuizes;
    }catch(error){
      logger.error(`Error fetching quizzes by quiz ID: ${id}`, { error });
      throw error;
    }
  },
  getUserQuizeQuestionByQuizID:  async (id: string) => {
    logger.info(`Fetching user quizze question by quiz ID: ${id}`);
   try{
        const count = await userQuizQuestionRepository.getUserQuizQuestionCountByQuizId(prismaInstance,id);
        if (count == 0) {
          logger.warn(`No user quizze question found for quiz ID: ${id}`);
          return false;
        }
        logger.info(`Fetched ${count} user quizze question for quiz ID: ${id}`);
        return true;
    }catch(error){
      logger.error(`Error fetching user quizze question by quiz ID: ${id}`, { error });
      throw error;
    }
  },
  getUserQuizesByUserName: async (id: string) => {
    logger.info(`Fetching user quizzes by username: ${id}`);
    try{
      const userExists = await userRepository.getUserByUsername(prismaInstance,id);
      if (!userExists) {
          logger.warn(`User not found: ${id}`);
          throw createError(HttpStatus.NOT_FOUND, "User not found");
      }

      const Quizzes = [];
      const userQuizes = await userQuizRepository.getUserQuizesByUsername(prismaInstance,id);
      if (!userQuizes || userQuizes.length === 0) {
        logger.warn(`No quizzes found for username: ${id}`);
          return [];
      }

      for(const userQuiz of userQuizes){
        if(userQuiz.is_submitted === false){
          const quiz = await quizRepository.getOnlyQuizById(prismaInstance,userQuiz.quiz_id);

          const currentDateTime = new Date();
          const endDateTime = quiz?.end_date_time ? new Date(quiz.end_date_time) : null;
  
          if (endDateTime && currentDateTime <= endDateTime) {
            Quizzes.push({
              quiz_id : quiz?.id,
              des : quiz?.description,
              dateAndTime : quiz?.start_date_time
            })
          }
        }
      }
      logger.info(`Fetched ${Quizzes.length} quizzes for username: ${id}`);
      return Quizzes;
    }catch(error){
      logger.error(`Error fetching quizzes by username: ${id}`, { error });
      throw error;
    }
  },

  createUserQuiz: async (userQuizList: any) => {
    logger.info(`Creating user quiz`);
    try {
       
        await prismaInstance.$transaction(async (prisma:any) => {
          logger.debug(`Checking existing user quizzes for conflict`);
          const existingUserQuizzes = await userQuizRepository.getUserQuizzesByUsernameAndQuizIdList(prisma,userQuizList);
  
          if (existingUserQuizzes && existingUserQuizzes.length>0) {
            logger.warn(`User Quiz already exists, cannot create duplicate`);
            throw createError(HttpStatus.CONFLICT, "User Quiz already exists");
          }

          const createUser = await userQuizRepository.createUserQuizesList(prisma,userQuizList)

          if(!createUser){
              logger.error(`Failed to create user quiz`);
              throw createError(HttpStatus.BAD_REQUEST, "Invalid input provided");
          }
          logger.info(`User quiz created successfully`);
        });
      } catch (error) {
        logger.error(`Error creating user quiz`, { error });
        throw error;
      }
  },
  deleteUserQuiz: async (userData: any) => {
    logger.info(`Deleting user quiz for user: ${userData.username} and quiz ID: ${userData.quizId}`);
    try{
        await prismaInstance.$transaction(async (prisma:any) => {

          const userQuizExists = await userQuizRepository.getUserQuizesByUsernameAndQuizId(prisma,userData);
  
          if (!userQuizExists) {
            logger.debug(`Checking if user quiz exists`);
            throw createError(HttpStatus.NOT_FOUND, "User Quiz not found");
          }

        const existingUserQuizQuestion = await userQuizQuestionRepository.getUserQuizQuestionsByQuizId(prisma,userData.quizId);

        if (existingUserQuizQuestion.length > 0){
          logger.warn(`Cannot delete user quiz, related quiz activities found`);
          throw createError(HttpStatus.BAD_REQUEST, "Can't delete this user because quiz was been done");
        }

        const deleteUserQuiz = await userQuizRepository.deleteUserQuizesByUsernameAndQuizId(prisma,userData.quizId,userData.username);

        if(!deleteUserQuiz){
          logger.error(`Failed to delete user quiz`);
          throw createError(HttpStatus.BAD_REQUEST, "Invalid request data");
        }
        logger.info(`User quiz deleted successfully`);
      });
    }catch(error){
      logger.error(`Error deleting user quiz`, { error });
      throw error;
    }
  
  }
    
};

export default userQuizService;