import { PrismaClient } from '@prisma/client';

const userQuizQuestionRepository = {
  getIndividualUserQuizQuestions : async (prismaInstance: PrismaClient , username:string, quizId:string ) => {
    return await prismaInstance.userQuizQuestion.findMany({
        where: {
          user_name: username,
          quiz_id: quizId,
        },
        select: {
          question_number : true,
          is_correct:true
        },
        orderBy:{
          question_number: "asc"
        }
    });
  },
  getUserQuizQuestions : async (prismaInstance: PrismaClient , userData:any ) => {
    return await prismaInstance.userQuizQuestion.findMany({
        where: {
          user_name: userData.username,
          quiz_id: userData.quizId,
        },
        include: {
          UserAnswers: true
        }
    });
  },
  getUserQuizQuestionsByQuizDetails : async (prismaInstance: PrismaClient , userData:any ) => {
    return await prismaInstance.userQuizQuestion.findMany({
      where: {
        user_name: userData.username,
        quiz_id: userData.quizId,
      },
      select: {
        user_name:true,
        quiz_id:true,
        question_number: true,
        Question:true,
        is_correct:true,
        UserAnswers: {
          select: {
              answer: true
          }
        }
      },
      orderBy:{
        question_number: "asc"
      }
    });
  },
  getQuestionsByUserQuiz : async (prismaInstance: PrismaClient , userData:any ) => {
    const results = await prismaInstance.userQuizQuestion.findMany({
      where: {
          user_name: userData.username,
          quiz_id: userData.quizId,
      },
      select: {
          question_number: true,
          question_id: true
      },
      orderBy: {
          question_number: 'desc'
      }
    });
    return results.map(q => q.question_id);
  },
  getQuestionByQuestionNumber : async (prismaInstance: PrismaClient , userData:any ) => {
    return await prismaInstance.userQuizQuestion.findFirst({
      where: {
        user_name: userData.username,
        quiz_id: userData.quizId,
        question_id: userData.question_id,
        question_number: userData.next_number
      },
      select: {
        user_name:true,
        quiz_id:true,
        question_number: true,
        Question:true,
        UserAnswers: {
          select: {
              answer: true
          }
        }
      }
    });
  },
    getUserQuizQuestionsByQuizId : async (prismaInstance: PrismaClient , id: string) => {
        return await prismaInstance.userQuizQuestion.findMany({
            where: {
              quiz_id: id,
            },
        });
    },
    getUserQuizQuestionCountByQuizId: async (prismaInstance: PrismaClient, id: string) => {
      return await prismaInstance.userQuizQuestion.count({
          where: {
              quiz_id: id,
          },
      });
    },
    getUserQuizQuestionsByQuestionId : async (prismaInstance: PrismaClient , id: string) => {
        return await prismaInstance.userQuizQuestion.findMany({
            where: {
                question_id: id,
            },
        });
    },
    getUserQuizQuestionsByUsername : async (prismaInstance: PrismaClient , username: string) => {
      return await prismaInstance.userQuizQuestion.findMany({
          where: {
              user_name: username,
          },
      });
    },
    findFirstUserQuizQuestionsByQuizId : async (prismaInstance: PrismaClient , id: string) => {
      return await prismaInstance.userQuizQuestion.findFirst({
          where: {
            quiz_id: id,
          },
      });
    },
    findFirstUserQuizQuestionsByQuestionId : async (prismaInstance: PrismaClient , id: string) => {
      return await prismaInstance.userQuizQuestion.findFirst({
          where: {
            question_id: id,
          },
      });
    },
    findFirstUserQuizQuestionsByUsername : async (prismaInstance: PrismaClient , username: string) => {
      return await prismaInstance.userQuizQuestion.findFirst({
          where: {
            user_name: username,
          },
      });
    },
    getUserQuizQuestionsByQuestionNumber : async (prismaInstance: PrismaClient , userData:any ) => {
      return await prismaInstance.userQuizQuestion.findFirst({
          where: {
            question_number: userData.next_number,
            user_name: userData.username,
            quiz_id: userData.quizId,
            question_id:userData.question_id
          }
      });
    },
    updateAndInsertQuizQuestions: async (prismaInstance: PrismaClient , userAnswerIsCorrect:any, userData: any) => {
        return await prismaInstance.userQuizQuestion.upsert({
            where: {
              user_name_quiz_id_question_id: {
                user_name: userData.username,
                quiz_id: userData.quizId,
                question_id: userData.questionId,
              },
            },
            update: {
              is_correct: userAnswerIsCorrect,
            },
            create: {
              question_number: userData.question_number,
              user_name: userData.username,
              quiz_id: userData.quizId,
              question_id: userData.questionId,
              is_correct: userAnswerIsCorrect,
            },
          })
    },
}

export default userQuizQuestionRepository;