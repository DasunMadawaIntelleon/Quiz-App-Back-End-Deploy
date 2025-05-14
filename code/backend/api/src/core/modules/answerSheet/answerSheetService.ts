import  {createPrismaClient}  from '../../database/prisma';
import logger from '../../utils/logger';
import userQuizQuestionRepository from '../userQuizQuestion/userQuizQuestionRepository';
import questionRepository from '../question/questionRepository';
import userQuizRepository from '../userQuiz/userQuizRepository';
import quizQuestionRepository from '../quizQuestion/quizQuestionRepository';
import quizRepository from '../quiz/quizRepository';
import userRepository from '../user/userRepository';
import { createError, HttpStatus } from '../../middlewares/customErrorHandler';
const prismaInstance = createPrismaClient();

const answerSheetService = {
    getIndividualAnswerSheets: async (username: string , quizId:string) => {
        try {
            logger.info(`Fetching individual answer sheets: ${username}, ${quizId}`);
            const userQuizDetails:any = [];
            let correctAnswers = 0 ;
            let wrongAnswers = 0 ;
            let userMarks = 0;
            let userRank = 0;
            const userData = {
                username : username,
                quizId : quizId
            }

            await prismaInstance.$transaction(async (prisma:any) => {
                const userExists = await userRepository.getUserByUsername(prisma,userData.username);
                if (!userExists) {
                    logger.warn(`User not found: ${username}`);
                    throw createError(HttpStatus.NOT_FOUND, "User not found");
                }

                const quizExists = await quizRepository.getOnlyQuizById(prisma,quizId);
                if (!quizExists) {
                    logger.warn(`Quiz not found: ${quizId}`);
                    throw createError(HttpStatus.NOT_FOUND, "Quiz not found");
                }

                const userQuizs = await userQuizRepository.findFirstUserQuizByQuizId(prisma,quizId);
                if (!userQuizs) {
                    logger.warn(`User quiz not found: ${quizId}`);
                    throw createError(HttpStatus.NOT_FOUND, "User quiz not found");
                }

                const userQuizResults = await userQuizQuestionRepository.getUserQuizQuestions(prisma , userData);
                if(userQuizResults.length === 0){
                    logger.warn(`Quiz has not been done: ${userData}`);
                    throw createError(HttpStatus.NOT_FOUND, "Quiz has not been done");
                }

                // create individual user answer sheet
                for(const userQuizResult of userQuizResults ){
                    const questionAnswer = await questionRepository.getQuestionByIdWithAnswers(prisma , userQuizResult.question_id);
                    userQuizDetails.push({
                        userAnswerDetails: {
                                question_answer : userQuizResult.question_number,
                                user_name: userQuizResult.user_name,
                                quiz_id : userQuizResult.quiz_id,
                                question_id : userQuizResult.question_id,
                                is_correct: userQuizResult.is_correct,
                                userAnswers:userQuizResult.UserAnswers.map((answer) => answer.answer)
                            },
                        questionDetails: {
                            question_id: questionAnswer?.id,
                            question: questionAnswer?.question,
                            a: questionAnswer?.a,
                            b: questionAnswer?.b,
                            c: questionAnswer?.c,
                            d: questionAnswer?.d,
                            question_type: questionAnswer?.question_type,
                            section: questionAnswer?.section,
                            questionAnswers:questionAnswer?.QuestionAnswer.map((answer)=>answer.answer)
                        }
                        
                    })

                    if(userQuizResult.is_correct === "CORRECT"){
                        correctAnswers++ ;
                    }
                    else if(userQuizResult.is_correct === "WRONG"){
                        wrongAnswers++ ;
                    }
                }
            
                const userRankStatus = await createRankListForQuizID(userData.quizId);

                userRankStatus?.map((user)=>{
                    if(user.user_name === userData.username){
                        userMarks = user.marks;
                        userRank = user.rank;
                    } 
                })
            });
            logger.info(`Fetched individual answer sheets: ${userData}`);
            return {userMarks,userRank,correctAnswers,wrongAnswers,userQuizDetails}
        } catch (error) {
            logger.error(`Error fetching individual answer sheets: ${username}, ${quizId}`, { error });
            throw error;
        }
    },
    getAnswerSheetByQuiz: async (id: string) => {
        try{
            logger.info(`Fetching user quiz answer sheets by quiz ID: ${id}`);
            
            const quizExists = await quizRepository.getOnlyQuizById(prismaInstance,id);
            if (!quizExists) {
                logger.warn(`Quiz not found: ${id}`);
                throw createError(HttpStatus.NOT_FOUND, "Quiz not found");
            }

            const userQuizs = await userQuizRepository.findFirstUserQuizByQuizId(prismaInstance,id);
            if (!userQuizs) {
                logger.warn(`User quiz not found: ${id}`);
                throw createError(HttpStatus.NOT_FOUND, "User quiz not found");
            }


            const quizData = await createRankListForQuizID(id);
            logger.info(`Fetched user quiz answer sheets by quiz ID: ${id}`);
            return quizData;
        }catch(error){
            logger.error(`Error fetching user quiz answer sheets by quiz ID: ${id}`, { error });
            throw error;
        }
    },
    getAnswerSheetByUsername: async (username: string) => {
        try{
            logger.info(`Fetching user quiz answer sheets by username: ${username}`);
            const quizDetails = new Set();
            let correctAnswers = 0
            const quizUsers = new Set();

            await prismaInstance.$transaction(async (prisma:any) => { 
                const userExists = await userRepository.getUserByUsername(prisma,username);
                if (!userExists) {
                    logger.warn(`User not found: ${username}`);
                    throw createError(HttpStatus.NOT_FOUND, "User not found");
                }

                const userQuiz = await userQuizRepository.findFirstUserQuizByUsername(prisma,username);
                if (!userQuiz) {
                    logger.warn(`User quiz not found: ${username}`);
                    throw createError(HttpStatus.NOT_FOUND, "User quiz not found");
                }

                const userQuizResults = await userQuizQuestionRepository.getUserQuizQuestionsByUsername(prisma , username);
                if(userQuizResults.length === 0){
                    logger.warn(`Quizes have not been done: ${username}`);
                    throw createError(HttpStatus.NOT_FOUND, "Quizes have not been done");
                }

                // get user marks and quizzes
                const userQuizs = await userQuizRepository.getUserQuizesByUsername(prisma,username);          
                
                // find the quizzes user has done
                for (const userQuiz of userQuizs) {
                    for (const userQuizResult of userQuizResults) {
                        if (userQuiz.quiz_id === userQuizResult.quiz_id) {
                            quizUsers.add(userQuiz.quiz_id); 
                        }
                    }
                }

                // get user marks
                for(const quiz of quizUsers){
                    let quizID:any = null;
                    for(const userQuizResult of userQuizResults){
                        if(quiz === userQuizResult.quiz_id){
                            if(userQuizResult.is_correct === "CORRECT"){
                                correctAnswers++;
                            }
                            quizID = userQuizResult.quiz_id;
                        }
                    } 
                    const allQuestions = await quizQuestionRepository.getQuizQuestionsByQuizId(prisma,quizID) 
                    let marks = correctAnswers/allQuestions.length * 100;

                    // get quiz date
                    const date = await quizRepository.getQuizDateById(prisma, quizID);
                    quizDetails.add({
                        quizId: quiz,
                        marks : marks,
                        date:  date
                    });
                    marks = 0 ;
                    correctAnswers = 0 ;
                }
            });
            logger.info(`Fetched user quiz answer sheets by username: ${username}`);
            return Array.from(quizDetails)
        }catch(error){
            logger.error(`Error fetching user quiz answer sheets by username: ${username}`, { error });
            throw error;
        }
    },
    latestQuizResults: async () => {
        try{
          logger.info('Fetching latest quiz');
          let latestQuiz = undefined
          const quizzes = await quizRepository.getLatestQuiz(prismaInstance);
         
          for(const quiz of quizzes){
            const userQuizs = await userQuizRepository.findFirstUserQuizByQuizId(prismaInstance,quiz.id);
            if(userQuizs){
                const userQuizAttemp = await userQuizQuestionRepository.findFirstUserQuizQuestionsByQuizId(prismaInstance, quiz.id);
                if(userQuizAttemp){
                latestQuiz = quiz.id;
                break;
                }
            }
          }
    
          const quizDetails = await createRankListForQuizID(latestQuiz);
         
          logger.info(`Fetched latest quiz`);
          return {latestQuiz,quizDetails}
        }catch(error){
          logger.error(`Error fetching latest quizzez`, { error });
          throw error;
        }
    },
    getQuizResults: async (username:string , quizId: string) => {
        logger.info('Fetching quiz');
        try{
            const userExists = await userRepository.getUserByUsername(prismaInstance,username);
            if (!userExists) {
                logger.warn(`User not found: ${username}`);
                throw createError(HttpStatus.NOT_FOUND, "User not found");
            }

            const quizExists = await quizRepository.getOnlyQuizById(prismaInstance,quizId);
            if (!quizExists) {
                logger.warn(`Quiz not found: ${quizId}`);
                throw createError(HttpStatus.NOT_FOUND, "Quiz not found");
            }
            
            const quiz = await userQuizQuestionRepository.getIndividualUserQuizQuestions(prismaInstance,username,quizId);

            logger.info(`Fetched quiz`);
            return quiz;
        }catch(error){
          logger.error(`Error fetching latest quizzez`, { error });
          throw error;
        }
    }
}
export default answerSheetService;

async function createRankListForQuizID(id: string) {
 
        const quizUserDetails = [] ;
        let correctAnswers = 0 ;
        let userRank = 1 ;
        const quizUsers = new Set();
        const quizUserDetailsWithMarks = [];

        const userQuizResults = await userQuizQuestionRepository.getUserQuizQuestionsByQuizId(prismaInstance ,id);
        if(userQuizResults.length === 0){
            logger.warn(`Quiz has not been done: ${id}`);
            throw createError(HttpStatus.NOT_FOUND, "Quiz has not been done");
        }

        // get user marks and ranks
        const userQuizs = await userQuizRepository.getUserQuizesByQuizId(prismaInstance,id);
        const allQuestions = await quizQuestionRepository.getQuizQuestionsByQuizId(prismaInstance,id) 
        const questionCount = allQuestions.length;            
        
        // find who has done the quiz
        for (const userQuiz of userQuizs) {
            for (const userQuizResult of userQuizResults) {
                if (userQuiz.user_name === userQuizResult.user_name) {
                    quizUsers.add(userQuiz.user_name);
                }
            }
        }

         // get user marks
        for(const user of quizUsers){
            for(const userQuizResult of userQuizResults){
                if(user === userQuizResult.user_name){
                    if(userQuizResult.is_correct === "CORRECT"){
                        correctAnswers++;
                    }
                }
            } 

            let userMarks = correctAnswers/questionCount * 100;

            quizUserDetails.push({
                user_name: user,
                marks : userMarks
            });
            userMarks = 0 ;
            correctAnswers = 0 ;
        }
        
         // get user ranks
        const sortedQuizDetail = quizUserDetails.sort((a, b) => b.marks - a.marks);
        let topMarks = sortedQuizDetail[0].marks;
        let currentRank = 1;
        for(const user of sortedQuizDetail){
            if(topMarks === user.marks){
                quizUserDetailsWithMarks.push({
                    user_name: user.user_name,
                    marks : user.marks,
                    rank: currentRank
                })
                userRank++;
            }
            else if(topMarks > user.marks){
                currentRank = userRank;
                quizUserDetailsWithMarks.push({
                    user_name: user.user_name,
                    marks : user.marks,
                    rank: userRank
                })
                topMarks = user.marks
                userRank++;
            }
        }
        return Array.from(quizUserDetailsWithMarks)
}