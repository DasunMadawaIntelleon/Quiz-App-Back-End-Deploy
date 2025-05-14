import userRepository from '../user/userRepository';
import  {createPrismaClient}  from '../../database/prisma';
import userQuizQuestionRepository from '../userQuizQuestion/userQuizQuestionRepository';
import questionAnswerRepository from '../questionAnswer/questionAnswerRepository';
import { createError, HttpStatus } from '../../middlewares/customErrorHandler';
import quizRepository from '../quiz/quizRepository';
import logger from '../../utils/logger';
import quizQuestionRepository from '../quizQuestion/quizQuestionRepository';
import questionRepository from '../question/questionRepository';
import userAnswerRepository from './userAnswerRepository';
import userQuizRepository from '../userQuiz/userQuizRepository';
const prismaInstance = createPrismaClient();

const userAnswerService = {
  createUserQuizQuestion: async (userData: any, token:any) => {
    logger.info(`Creating quiz question for user: ${userData.username}`);
    const base64Url = token.split(".")[1];
    const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
    const userDetails = JSON.parse(Buffer.from(base64, "base64").toString("utf-8"));

    if(userDetails.username !== userData.username){
      logger.warn(`Unprocessable Content: ${userData.username}`);
      throw createError(HttpStatus.UNPROCESSABLE_CONTENT, "Unprocessable Content");
    }

    try{
      const userAnswers = userData.userAnswers;
      let userAnswerIsCorrect:string = "EMPTY";
      let nextQuestion:any;
      let answeredQuestions:any = []
      const count = Object.values(userData).length;

      // check user name
      const userExists = await userRepository.getUserByUsername(prismaInstance,userData.username);
      if (!userExists) {
          logger.warn(`User not found: ${userData.username}`);
          throw createError(HttpStatus.NOT_FOUND, "User not found");
      }

      // check quiz
      const quizExists = await quizRepository.getOnlyQuizById(prismaInstance,userData.quizId);
      if (!quizExists) {
          logger.warn(`Quiz not found: ${userData.quizId}`);
          throw createError(HttpStatus.NOT_FOUND, "Quiz not found");
      }

      // function to quiz start.
      if(count === 2){
        const existingUserQuiz = await userQuizQuestionRepository.getUserQuizQuestionsByQuizDetails(prismaInstance,userData);

        // If even one question is not answered, a new random question will be given.
        if(existingUserQuiz.length === 0){
          const questions = await quizQuestionRepository.getQuizQuestionsByQuizId(prismaInstance,userData.quizId);
          // get new random question
          const index = Math.floor(Math.random() * questions.length); 
          const question = questions[index];
          const details = await questionRepository.getQuestionById(prismaInstance,question.question_id);
          const answers = details?.question_type ==="TRUE_FALSE"? [{id : "A",value : details?.a},{id : "B",value : details?.b}] :
                          [{id : "A",value : details?.a},{id : "B",value : details?.b},{id : "C",value : details?.c},{id : "D",value : details?.d}]
          nextQuestion={ // set value for respone
            id : details?.id,
            question : details?.question,
            question_type : details?.question_type,
            answers : answers, // Answers of question
            userAnswers :[], // Answers given to questions by the user. This time, return an empty array because it's a new question.
            question_number : 1,
          }
        }
        // Get last question 
        if(existingUserQuiz.length > 0){
          const details = existingUserQuiz[existingUserQuiz.length-1]
          const answers = details.Question.question_type ==="TRUE_FALSE"? [{id : "A",value : details.Question.a},{id : "B",value : details.Question.b}] :
          [{id : "A",value : details.Question.a},{id : "B",value : details.Question.b},{id : "C",value : details.Question.c},{id : "D",value : details.Question.d}]
          nextQuestion={ // set value for respone
            id : details.Question.id,
            question : details.Question.question,
            question_type : details.Question.question_type,
            answers : answers, // Answers of question
            userAnswers :details.UserAnswers.map((ans: any) => ans.answer),// Answers given to questions by the user
            question_number : details.question_number,
          }

          // Setting the array without the "empty" value for question overview
          existingUserQuiz.map((question)=>{
            if(question.is_correct !== "EMPTY"){
               answeredQuestions.push(question.question_number)
            }
          })
        }
      }

      // Function for handling user replies.
      if(count === 7){
        await prismaInstance.$transaction(async (prisma:any) => {
        
          // check answer duplicates
          const nonDuplicateValue = new Set(userAnswers.map((answer: any)=>answer));
          if(nonDuplicateValue.size !== userAnswers.length ){
            logger.warn(`User Answers are duplicate"`);
            throw createError(HttpStatus.CONFLICT, "User Answers are duplicate");
          }
  
          // check question
          const existingQuestion = await questionRepository.getQuestionById(prisma,userData.questionId);
          if (!existingQuestion) {
            logger.warn(`Question not found: ${userData.questionId}`);
            throw createError(HttpStatus.NOT_FOUND, "Question not found");
          }
    
          // Setting the array without the "empty" value for question overview
          if(userAnswers.length === 0){
            userAnswerIsCorrect = "EMPTY";
          }else{
            // User answer whether correct or not
            const checkAnswers = await questionAnswerRepository.getQuestionAnswersByQuestionId(prisma,userData.questionId);
  
            if(checkAnswers.length >= userAnswers.length){
              for (const checkAnswer of checkAnswers) {
                const matchingCheckAnswer = userAnswers.find((userAnswer: string) =>
                  userData.questionId === checkAnswer.question_id &&
                  userAnswer === checkAnswer.answer 
                );
              
                if (!matchingCheckAnswer) {
                  userAnswerIsCorrect = "WRONG";
                  logger.warn(`Incorrect answer found for user: ${userData.username}, Question ID: ${userData.questionId}`);
                  break; 
                }else{
                  userAnswerIsCorrect = "CORRECT";
                }
              }
            }
  
            if(userAnswers.length > checkAnswers.length){
              for (const userAnswer of userAnswers) {
                const matchingCheckAnswer = checkAnswers.find((checkAnswer: { question_id: string; answer: string; }) =>
                  checkAnswer.question_id === userData.questionId &&
                  checkAnswer.answer === userAnswer
                );
            
                if (!matchingCheckAnswer) {
                  logger.warn(`Extra incorrect answers provided by user: ${userData.username}, Question ID: ${userData.question_id}`);
                  userAnswerIsCorrect = "WRONG";
                  break; 
                }else{
                  userAnswerIsCorrect = "CORRECT";
                }
              }
            }
          }
          
          //Update the question answer status provided by the user 
          const createUserQuizQuestion = await userQuizQuestionRepository.updateAndInsertQuizQuestions(prisma,userAnswerIsCorrect,userData);
          if(!createUserQuizQuestion){
            throw createError(HttpStatus.BAD_REQUEST, "Invalid request data");
          }
          
          //Update user provided question answer status 
          await userAnswerRepository.deleteUserAnswer(prisma,userData);
  
          if (userAnswers.length > 0) {
            const createUserAnswer = await userAnswerRepository.createUserAnswers(prisma,userAnswers,userData);
          
            if(!createUserAnswer){
              logger.error(`Failed to insert user answers into the database: ${userData.username}`);
              throw createError(HttpStatus.BAD_REQUEST, "Invalid request data");
            }
          }

          // Next button functions
          if(userData.next_number>userData.question_number){
  
            const questionAnswerIsExist = await userQuizQuestionRepository.getUserQuizQuestionsByQuestionNumber(prisma,userData);
            // If even one question is not answered, a new random question will be given.
            if(!questionAnswerIsExist){
              const userQuizQuestions = await userQuizQuestionRepository.getQuestionsByUserQuiz(prisma,userData)
    
              const questions = await quizQuestionRepository.getQuizQuestionsByQuizId(prisma,userData.quizId);
            
              while(true){
                const index = Math.floor(Math.random() * questions.length); 
                const question = questions[index]
                const existingQuestion = userQuizQuestions.includes(question.question_id)
                
                if(!existingQuestion){
                  const details = await questionRepository.getQuestionById(prisma,question.question_id);
                  const answers = details?.question_type ==="TRUE_FALSE"? [{id : "A",value : details?.a},{id : "B",value : details?.b}] :
                          [{id : "A",value : details?.a},{id : "B",value : details?.b},{id : "C",value : details?.c},{id : "D",value : details?.d}]
                  nextQuestion={ // set value for respone
                    id : details?.id,
                    question : details?.question,
                    question_type : details?.question_type,
                    answers : answers, //Answers of question
                    userAnswers : [], // Answers given to questions by the user. This time, return an empty array because it's a new question.
                    question_number : userData.next_number,
                  }
                  break;
                }
              }
            }
            else{
              // Get existing question 
              const details = await userQuizQuestionRepository.getQuestionByQuestionNumber(prisma,userData);
              const answers = details?.Question.question_type ==="TRUE_FALSE"? [{id : "A",value : details.Question.a},{id : "B",value : details.Question.b}] :
              [{id : "A",value : details?.Question.a},{id : "B",value : details?.Question.b},{id : "C",value : details?.Question.c},{id : "D",value : details?.Question.d}]
              nextQuestion={ // set value for respone
                id : details?.Question.id,
                question : details?.Question.question,
                question_type : details?.Question.question_type,
                answers : answers, //Answers of question.
                userAnswers :details?.UserAnswers.map((ans: any) => ans.answer), // Answers given to questions by the user.
                question_number : details?.question_number,              
              }
            }
          } else{ // Preview button functions
            const details = await userQuizQuestionRepository.getQuestionByQuestionNumber(prisma,userData);
            const answers = details?.Question.question_type ==="TRUE_FALSE"? [{id : "A",value : details.Question.a},{id : "B",value : details.Question.b}] :
            [{id : "A",value : details?.Question.a},{id : "B",value : details?.Question.b},{id : "C",value : details?.Question.c},{id : "D",value : details?.Question.d}]
            nextQuestion={ // set value for respone
              id : details?.Question.id,
              question : details?.Question.question,
              question_type : details?.Question.question_type,
              answers : answers, //Answers of question.
              userAnswers :details?.UserAnswers.map((ans: any) => ans.answer), // Answers given to questions by the user.
              question_number : details?.question_number,
            }
          }
        });

        // Setting the array without the "empty" value for question overview
        const existingUserQuiz = await userQuizQuestionRepository.getUserQuizQuestionsByQuizDetails(prismaInstance,userData);
          existingUserQuiz.map((question)=>{
            if(question.is_correct !== "EMPTY"){
                answeredQuestions.push(question.question_number)
            }
          })
        }

        // Submit button functions
        if(userData.is_submitted === true){
          const updateUserQuiz = await userQuizRepository.updateUserQuizesList(prismaInstance,userData)
          if(updateUserQuiz){
            nextQuestion={ // set empty value for respone
              id : "",
              question : "",
              question_type : "",
              answers : [],
              userAnswers : [],
              question_number : 0,
            };
  
            answeredQuestions = [] // set empty value for respone
          }
        }
      logger.info(`Quiz question processing completed successfully for user: ${userData.username}`);
      return {nextQuestion,answeredQuestions}
    } catch(error){
      logger.error(`Error creating quiz question for user: ${userData.username}`, { error });
      throw error
    }
  } 
    
};

export default userAnswerService;
