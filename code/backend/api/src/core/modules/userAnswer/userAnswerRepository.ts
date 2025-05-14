import { PrismaClient } from '@prisma/client';

const userAnswerRepository = {

    deleteUserAnswer: async (prismaInstance: PrismaClient, userData:any) => {
        return await prismaInstance.userAnswer.deleteMany({
            where: {
              question_number: userData.question_number,
              user_name: userData.username,
              quiz_id: userData.quizId,
              question_id: userData.questionId,
            }
          })
    },
    createUserAnswers: async (prismaInstance: PrismaClient,userAnswers:any, userData:any) => {
        return await prismaInstance.userAnswer.createMany({
            data: userAnswers.map((userAnswer: string) => ({
              question_number: userData.question_number,
              user_name: userData.username,
              quiz_id: userData.quizId,
              question_id: userData.questionId,
              answer: userAnswer,
            })),
            skipDuplicates: true,
          });
    },
    getUserAnswers: async (prismaInstance: PrismaClient, userData:any) => {
      return await prismaInstance.userAnswer.findMany({
        where:{
          user_name: userData.username,
          quiz_id: userData.quizId,
        }
      });
    },
}

export default userAnswerRepository;