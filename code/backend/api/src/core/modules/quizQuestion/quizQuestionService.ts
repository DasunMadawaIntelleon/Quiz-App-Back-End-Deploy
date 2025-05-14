import quizQuestionRepository from './quizQuestionRepository';
import  {createPrismaClient}  from '../../database/prisma';
import { createError, HttpStatus } from '../../middlewares/customErrorHandler';
import logger from '../../utils/logger';
import quizRepository from '../quiz/quizRepository';
import questionRepository from '../question/questionRepository';
const prismaInstance = createPrismaClient();

const quizQuestionService = {
  getQuizQuestionByQuizId: async (quizId:any) => {
   try{
        logger.info(`Fetching quiz questions for quiz ID: ${quizId}`);
        const quizQuestions = await quizQuestionRepository.getQuizQuestionsByQuizId(prismaInstance,quizId);
        if (!quizQuestions || quizQuestions.length === 0) {
          logger.warn(`No quiz questions found for quiz ID: ${quizId}`);
          throw createError(HttpStatus.NOT_FOUND, "Quiz question not exists");
        }
        logger.info(`Fetched ${quizQuestions.length} quiz questions for quiz ID: ${quizId}`);
        return quizQuestions;
    }catch(error){
      logger.error(`Error fetching quiz questions for quiz ID: ${quizId}`, { error });
      throw error;
    }
  },
  getQuizListByQuestionId: async (questionId:any) => {
    try{
        const question = await questionRepository.getQuestionById(prismaInstance,questionId);
        if (!question) {
          logger.warn(`Question not found: ${questionId}`);
          throw createError(HttpStatus.NOT_FOUND, "Question not found");
        }
         logger.info(`Fetching quiz questions for question ID: ${questionId}`);
         const quizQuestions = await quizQuestionRepository.getQuizQuestionsByQuestionId(prismaInstance,questionId);
         if (!quizQuestions || quizQuestions.length === 0) {
           logger.warn(`No quiz questions found for quiz ID: ${questionId}`);
           throw createError(HttpStatus.NOT_FOUND, "Question not exists in Quises");
         }
         const quizIds = quizQuestions.map((details)=>(details.quiz_id))

         const existingQuizes = await quizRepository.getAllQuizBylist(prismaInstance,quizIds);

         logger.info(`Fetched ${existingQuizes.length} quiz for questions ID: ${questionId}`);
         return existingQuizes;
     }catch(error){
       logger.error(`Error fetching quiz for questions ID: ${questionId}`, { error });
       throw error;
     }
   },
  createQuizQuestion: async (userData: any) => {
    try {
        logger.info(`Creating a new quiz question`, { userData });
        await prismaInstance.$transaction(async (prisma:any) => {

          const quizExists = await quizRepository.getOnlyQuizById(prisma,userData.quizId);
          if (!quizExists) {
              logger.warn(`Quiz not found: ${userData.quizId}`);
              throw createError(HttpStatus.NOT_FOUND, "Quiz not found");
          }

          const existingQuestion = await questionRepository.getQuestionById(prisma,userData.questionId);
          if(!existingQuestion){
            logger.warn(`Question not found: ${userData.questionId}`);
            throw createError(HttpStatus.NOT_FOUND, "Question not found");
          }
          
          const existingQuizQuestion = await quizQuestionRepository.getQuizQuestion(prismaInstance,userData.quizId,userData.questionId);
  
          if(existingQuizQuestion.length > 0){
            logger.warn(`Quiz question already exists for quiz ID: ${userData.quizId} and question ID: ${userData.questionId}`);
            throw createError(HttpStatus.CONFLICT, "Quiz question already exists");
          }
          
          const createQuizQuestion = await quizQuestionRepository.createQuizQuestion(prismaInstance,userData.quizId,userData.questionId,userData.question_number)
  
          if(!createQuizQuestion){
            logger.warn('Failed to create quiz question', { userData });
            throw createError(HttpStatus.BAD_REQUEST, "Invalid input provided");
          }
          logger.info(`Successfully created quiz question for quiz ID: ${userData.quizId}`);
        });
      } catch (error) {
        logger.error(`Error creating quiz question`, { error });
        throw error;
      }
  },
  deleteQuizQuestion: async (userData:any) => {
    try {
        logger.info(`Deleting quiz question for quiz ID: ${userData.quizId} and question ID: ${userData.questionId}`);
        
        await prismaInstance.$transaction(async (prisma:any) => {

          const existingQuizQuestion = await quizQuestionRepository.getQuizQuestion(prisma,userData.quizId,userData.questionId);
  
          if(!existingQuizQuestion || existingQuizQuestion.length == 0){
            logger.warn(`Quiz question does not exist for quiz ID: ${userData.quizId} and question ID: ${userData.questionId}`);
            throw createError(HttpStatus.NOT_FOUND, "Quiz question not exists");
          }

          const deleteQuizQuestion = await quizQuestionRepository.deleteQuizQuestion(prisma,userData.quizId,userData.username);

          if(!deleteQuizQuestion){
            logger.warn(`Failed to delete quiz question for quiz ID: ${userData.quizId}`);
            throw createError(HttpStatus.BAD_REQUEST, "Invalid request data");
          }
          logger.info(`Successfully deleted quiz question for quiz ID: ${userData.quizId}`);
        });
      } catch (error) {
        logger.error(`Error deleting quiz question`, {error});
        throw error;
      }
    }
    
};

export default quizQuestionService;
