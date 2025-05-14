import quizRepository from './quizRepository';
import questionRepository from '../question/questionRepository';
import userQuizRepository from '../userQuiz/userQuizRepository';
import quizQuestionRepository from '../quizQuestion/quizQuestionRepository';
import  {createPrismaClient}  from '../../database/prisma';
import userQuizQuestionRepository from '../userQuizQuestion/userQuizQuestionRepository';
import { createError, HttpStatus } from '../../middlewares/customErrorHandler';
import logger from '../../utils/logger';
const prismaInstance = createPrismaClient();

const quizService = {
  getAllQuizzes: async () => {
   try{
        logger.info('Fetching all quizzes');
        const quiz = await quizRepository.getAllQuizs(prismaInstance);
        if (!quiz || quiz.length === 0) {
            logger.warn('No quizzes found');
            return [];
        }
        logger.info(`Fetched ${quiz.length} quizzes`);
        return quiz;
    }catch(error){
      logger.error('Error fetching all quizzes', { error });
      throw error;
    }
  },
  getAllQuizzesDate: async () => {
    try{
      logger.info('Fetching all quizzes Dates');
      const quizDates = await quizRepository.getAllQuizzesDates(prismaInstance);

      if (!quizDates || quizDates.length === 0) {
        logger.warn('No quizzes found');
        return [];
      }

      logger.info(`Fetched ${quizDates.length} quizzes Dates`);
      return quizDates;
    }catch(error){
      logger.error(`Error fetching all quizzes dates`, { error });
      throw error;
    }
  },
  getQuizById: async (id: string) => {
    try{
        logger.info(`Fetching quiz by ID: ${id}`);
        const quiz = await quizRepository.getQuizById(prismaInstance,id);

        if (!quiz) {
          logger.warn(`Quiz not found: ${id}`);
          throw createError(HttpStatus.NOT_FOUND, "Quiz not found");
        }
        logger.info(`Fetched quiz: ${id}`);
        return {quiz};

    }catch(error){
      logger.error(`Error fetching quiz by ID: ${id}`, { error });
      throw error;
    }
  },

  createQuiz: async (quizData: any) => {
    try {
        logger.info('Creating new quiz', { quizData });
        const quizQuestions = quizData.quizQuestion;
       
        await prismaInstance.$transaction(async (prisma:any) => {
          const quizExists = await quizRepository.getQuizById(prisma,quizData.id);
  
          if (quizExists) {
            logger.warn(`Quiz already exists: ${quizData.id}`);
            throw createError(HttpStatus.CONFLICT, "Quiz already exists");
          }
          
          const questionIds = quizQuestions.map((item:any) => item.questionId);

          const questions = await questionRepository.getQuestionByQuestionIds(prisma,questionIds)
     
          const foundQuestionIds = new Set(questions.map(q => q.id));
      
          const missingQuestionIds = questionIds.filter((questionId:any) => !foundQuestionIds.has(questionId));
      
          if (missingQuestionIds.length > 0) {
            logger.warn(`Questions not found: ${missingQuestionIds}`);
            throw createError(HttpStatus.BAD_REQUEST, "Question not found");
          }
  
          const createQuiz = await quizRepository.createQuiz(prisma,quizData)
  
          if(createQuiz){
            const createQuizQuestion = await quizQuestionRepository.createQuizQuestionList(prisma,quizData.id,quizQuestions)
            
            if(!createQuizQuestion){
              logger.warn('Invalid input provided during quiz creation', { quizData });
              throw createError(HttpStatus.BAD_REQUEST, "Invalid input provided");
            }
          }
          logger.info(`Successfully created quiz: ${quizData.id}`);
        });
      } catch (error) {
        logger.error('Error creating quiz', { error});
        throw error;
      }
  },

  updateQuiz: async (id: string, quizData: any) => {
    try {
        logger.info(`Updating quiz: ${id}`, { quizData });
        await prismaInstance.$transaction(async (prisma:any) => {
          const quizExists = await quizRepository.getQuizById(prisma,id);
  
          if (!quizExists) {
            logger.warn(`Quiz not found: ${id}`);
            throw createError(HttpStatus.NOT_FOUND, "Quiz not found");
          }
         
          const existingUserQuizQuestion = await userQuizQuestionRepository.findFirstUserQuizQuestionsByQuizId(prisma,id);
  
          if (existingUserQuizQuestion){
            logger.warn(`Cannot delete quiz ${id}, it is associated with completed quizzes`);
            throw createError(HttpStatus.BAD_REQUEST, "Can't update this quiz because quiz was been done");
          }

          const deleteQuizQuestion =await quizQuestionRepository.deleteQuizQuestionByQuizId(prisma,id);
     
          if(!deleteQuizQuestion){
            logger.warn(`Failed to delete Quiz Question: ${id}`);
            throw createError(HttpStatus.BAD_REQUEST, "Invalid request data");
          }

          const createQuizQuestion = await quizQuestionRepository.createQuizQuestionList(prisma,id,quizData.quizQuestion)
            
            if(!createQuizQuestion){
              logger.warn('Invalid input provided during quiz creation', { quizData });
              throw createError(HttpStatus.BAD_REQUEST, "Invalid input provided");
            }

          const updateQuiz = await quizRepository.updateQuiz(prisma,id,quizData);

          if(!updateQuiz){
            logger.warn(`Failed to update quiz: ${id}`);
            throw createError(HttpStatus.BAD_REQUEST, "Invalid request data");
          }
          logger.info(`Successfully updated quiz: ${id}`);
        });
      } catch (error) {
        logger.error(`Error updating quiz: ${id}`, { error });
        throw error;
      }
  },

  deleteQuiz: async (id: string) => {
    try {
        logger.info(`Deleting quiz: ${id}`);
        await prismaInstance.$transaction(async (prisma:any) => {

          const quizExists = await quizRepository.getQuizById(prisma,id);
  
          if (!quizExists) {
            logger.warn(`Quiz not found: ${id}`);
            throw createError(HttpStatus.NOT_FOUND, "Quiz not found");
          }
  
          const existingUserQuizQuestion = await userQuizQuestionRepository.findFirstUserQuizQuestionsByQuizId(prisma,id);
  
          if (existingUserQuizQuestion){
            logger.warn(`Cannot delete quiz ${id}, it is associated with completed quizzes`);
            throw createError(HttpStatus.BAD_REQUEST, "Can't delete this quiz because quiz was been done");
          }
  
          const existingUserQuiz = await userQuizRepository.getUserQuizesByQuizId(prisma,id);
  
          if (existingUserQuiz) {
            await userQuizRepository.deleteUserQuizes(prisma,id);
          }
         
          const quizQuestion = await quizQuestionRepository.getQuizQuestionsByQuizId(prisma,id)
  
          if (quizQuestion) {
            await quizQuestionRepository.deleteQuizQuestionByQuizId(prisma,id);
          }

          const deleteQuiz = await quizRepository.deleteQuiz(prisma,id);

          if(!deleteQuiz){
            logger.warn(`Failed to delete quiz: ${id}`);
            throw createError(HttpStatus.BAD_REQUEST, "Invalid request data");
          }
          logger.info(`Successfully deleted quiz: ${id}`);
        });
      } catch (error) {
        logger.error(`Error deleting quiz: ${id}`, { error });
        throw error;
      }
    }
    
};

export default quizService;
