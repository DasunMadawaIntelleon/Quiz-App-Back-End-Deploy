import questionRepository from './questionRepository';
import questionAnswerRepository from '../questionAnswer/questionAnswerRepository';
import userQuizQuestionRepository from '../userQuizQuestion/userQuizQuestionRepository';
import quizQuestionRepository from '../quizQuestion/quizQuestionRepository';
import  {createPrismaClient}  from '../../database/prisma';
import { createError, HttpStatus } from '../../middlewares/customErrorHandler';
import logger from '../../utils/logger';

const prismaInstance = createPrismaClient();

const questionService = {
  getAllQuestions: async () => {
   try{
        logger.info('Fetching all questions');
        const questions = await questionRepository.getAllQuestions(prismaInstance);
        if (!questions || questions.length === 0) {
            logger.warn('No questions found');
            return [];
        }
        logger.info(`Fetched ${questions.length} questions`);
        return questions;
    }catch(error){
      logger.error('Error fetching all questions', { error });
      throw error;
    }
  },
  getAllActiveQuestions: async () => {
    try{
        logger.info('Fetching all active questions');
         const questions = await questionRepository.getAllActiveQuestions(prismaInstance);
         if (!questions || questions.length === 0) {
            logger.warn('No active questions found');
             return [];
         }
         logger.info(`Fetched ${questions.length} active questions`);
         return questions;
     }catch(error){
       logger.error('Error fetching all active questions', { error });
       throw error;
     }
   },

  getQuestionById: async (id: string) => {
    try{
      logger.info(`Fetching question by ID: ${id}`);
        const question = await questionRepository.getQuestionById(prismaInstance,id);
        if (!question) {
            logger.warn(`Question not found: ${id}`);
            throw createError(HttpStatus.NOT_FOUND, "Question not found");
          }
          logger.info(`Fetched question: ${id}`);
        return question;
    }catch(error){
      logger.error(`Error fetching question by ID: ${id}`, { error });
      throw error;
    }
  },

  updateInactiveQuestion: async (id: string) => {
    try{
      logger.info(`Updating question to inactive: ${id}`);
      await prismaInstance.$transaction(async (prisma:any) => {

      const existingQuestion = await questionRepository.getQuestionById(prisma,id);

      if (!existingQuestion) {
        logger.warn(`Question not found: ${id}`);
        throw createError(HttpStatus.NOT_FOUND, "Question not found");
      }
      
        existingQuestion.active = false
     
        const updateQuestion = await questionRepository.updateQuestion(prisma,id,existingQuestion);
  
          if (!updateQuestion) {
            logger.warn(`Failed to update question: ${id}`);
            throw createError(HttpStatus.BAD_REQUEST, "Invalid request data");
          }
          logger.info(`Successfully updated question to inactive: ${id}`);
      });
    }catch(error){
      logger.error(`Error updating question to inactive: ${id}`, { error });
      throw error;
    }
  },

  createQuestion: async (questionData: any) => {
    try {
        logger.info('Creating a new question', { questionData });
        const questionAnswers = questionData.answer;
       
        await prismaInstance.$transaction(async (prisma:any) => {
          const questionExists = await questionRepository.getQuestionById(prisma,questionData.id);
  
          if (questionExists) {
            logger.warn(`Question already exists: ${questionData.id}`);
            throw createError(HttpStatus.CONFLICT, "Question already exists");
          }
          const nonDuplicateValue = new Set(questionAnswers.map((question: any)=>question.answer));
          if(nonDuplicateValue.size !== questionAnswers.length ){
            logger.warn(`Question Answers are duplicate"`);
            throw createError(HttpStatus.CONFLICT, "Question Answers are duplicate");
          }

          if(questionAnswers.find((question:any) =>question.question_id !== questionData.id)){
            logger.warn(`Invalid question ID`);
            throw createError(HttpStatus.BAD_REQUEST, "Invalid request data");
          }
          const createQuestion = await questionRepository.createQuestion(prisma,questionData);
  
          const createQuestionAnswer = await questionAnswerRepository.createQuestionAnswer(prisma,questionAnswers);
  
          if (!createQuestion || createQuestionAnswer.count === 0) {
            logger.warn('Invalid input provided during question creation', { questionData });
            throw createError(HttpStatus.BAD_REQUEST, "Invalid input provided");
          }
          logger.info(`Successfully created question: ${questionData.id}`);
        });
      } catch (error) {
          logger.error('Error creating question', { error });
          throw error;
      }
  },

  updateQuestion: async (id: string, questionData: any) => {
    try {
        logger.info(`Updating question: ${id}`, { questionData });
        const questionAnswers = questionData.answer;
       
        await prismaInstance.$transaction(async (prisma:any) => {
          const questionExists = await questionRepository.getQuestionById(prisma,id)
  
          if (!questionExists) {
            logger.warn(`Question not found: ${id}`);
            throw createError(HttpStatus.NOT_FOUND, "Question not found");
          }
          
          await questionAnswerRepository.deleteQuestionAnswer(prisma,id);

          const createQuestionAnswer = await questionAnswerRepository.createQuestionAnswer(prisma,questionAnswers);

          if(createQuestionAnswer.count==0){
            logger.warn(`Invalid question answers for update: ${id}`);
            throw createError(HttpStatus.BAD_REQUEST, "Invalid request data");
          }

          const updateQuestion = await questionRepository.updateQuestion(prisma,id,questionData);
  
          if (!updateQuestion) {
            logger.warn(`Failed to update question: ${id}`);
            throw createError(HttpStatus.BAD_REQUEST, "Invalid request data");
          }
          logger.info(`Successfully updated question: ${id}`);
        });
      } catch (error:any) {
        logger.error(`Error updating question: ${id}`, { questionData, error: error.message });
          throw error;
      }
  },

  deleteQuestion: async (id: string) => {
    try {
        logger.info(`Deleting question: ${id}`);
        await prismaInstance.$transaction(async (prisma:any) => {

          const existingQuestion = await questionRepository.getQuestionById(prisma,id);

          
          if(!existingQuestion){
            logger.warn(`Question not found: ${id}`);
            throw createError(HttpStatus.NOT_FOUND, "Question not found");
          }
  
          const existingUserQuizQuestion = await userQuizQuestionRepository.getUserQuizQuestionsByQuestionId(prisma,id);
  
          if (existingUserQuizQuestion.length > 0){
            logger.warn(`Cannot delete question, it is linked to quizzes: ${id}`);
            throw createError(HttpStatus.BAD_REQUEST, "Can't delete this question because quiz was been done");
          }
  
          const existingQuizQuestion = await quizQuestionRepository.getQuizQuestionsByQuestionId(prisma,id);
  
          if (existingQuizQuestion) {
            await quizQuestionRepository.deleteQuizQuestionByQuestionId(prisma,id);
          }
         
          const deleteQuestionAnswer = await questionAnswerRepository.deleteQuestionAnswer(prisma,id)
    
          const deleteQuestion = await questionRepository.deleteQuestion(prisma,id);
  
          if(!deleteQuestion || deleteQuestionAnswer.count === 0){
            logger.warn(`Failed to delete question: ${id}`);
            throw createError(HttpStatus.BAD_REQUEST, "Invalid request data");
          }
          logger.info(`Successfully deleted question: ${id}`);
        });
      } catch (error) {
        logger.error(`Error deleting question: ${id}`, { error });
        throw error;
      }
    },
    questionAttempts: async (id: string) => {
      let successAttempts = 0;
      let faildAttempts = 0;
      let emptyAttempts = 0;
  
      const existingQuestion = await questionRepository.getQuestionById(prismaInstance,id);
  
      if(!existingQuestion){
        logger.warn(`Question not found: ${id}`);
        throw createError(HttpStatus.NOT_FOUND, "Question not found");
      }
  
      const userQuizResults = await userQuizQuestionRepository.getUserQuizQuestionsByQuestionId(prismaInstance , id);
      for(const result of userQuizResults){
        if(result.is_correct === "CORRECT"){
          successAttempts++;
        }
        else if(result.is_correct === "WRONG"){
          faildAttempts++;
        }
        else if(result.is_correct === "EMPTY"){
          emptyAttempts++;
        }
      }
      return{successAttempts,faildAttempts,emptyAttempts}
    }
    
};

export default questionService;
