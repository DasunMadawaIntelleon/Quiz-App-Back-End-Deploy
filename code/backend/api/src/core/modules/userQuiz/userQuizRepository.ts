import { PrismaClient } from '@prisma/client';

const userQuizRepository = {

    getUserQuizesByQuizId : async (prismaInstance: PrismaClient , id: string) => {
        return await prismaInstance.userQuiz.findMany({
            where: {
              quiz_id: id,
            },
        });
    },
    getUserQuizesByUsername : async (prismaInstance: PrismaClient , username: string) => {
      return await prismaInstance.userQuiz.findMany({
        where : {
          user_name : username
        },
      });
    },
    getUserQuizesByUsernameAndQuizId : async (prismaInstance: PrismaClient , userQuiz:any) => {
      return await prismaInstance.userQuiz.findFirst({
        where: {
              quiz_id: userQuiz.quizId,
              user_name: userQuiz.username,
          },
      });
    },
    getUserQuizzesByUsernameAndQuizIdList : async (prismaInstance: PrismaClient, userQuizzes:any[]) => {
      return await prismaInstance.userQuiz.findMany({
        where: {
          OR: userQuizzes.map((userQuiz:any) => ({
            quiz_id: userQuiz.quiz_id,
            user_name: userQuiz.user_name,
          })),
        },
      });
    },
    findFirstUserQuizByQuizId : async (prismaInstance: PrismaClient , id: string) => {
      return await prismaInstance.userQuiz.findFirst({
          where: {
            quiz_id: id,
          },
      });
    },
    findFirstUserQuizByUsername : async (prismaInstance: PrismaClient , username: string) => {
      return await prismaInstance.userQuiz.findFirst({
          where: {
            user_name: username,
          },
      });
    },
    deleteUserQuizes: async (prismaInstance: PrismaClient, id: string) => {
        return await prismaInstance.userQuiz.deleteMany({
            where: {
              quiz_id: id
            }
          });
    },
    deleteUserQuizesByUsername: async (prismaInstance: PrismaClient, username: string) => {
      return await prismaInstance.userQuiz.deleteMany({
          where: {
            user_name : username
          }
        });
    },
    deleteUserQuizesByUsernameAndQuizId: async (prismaInstance: PrismaClient, quizId: string, username: string) => {
      return await prismaInstance.userQuiz.deleteMany({
          where: {
            quiz_id: quizId,
            user_name : username
          }
        });
  },
    createUserQuizesList: async (prismaInstance: PrismaClient, userQuizList: any) => {

      return await prismaInstance.userQuiz.createMany({
        data: userQuizList.map((user: { quizId: string,username: string; })=> ({
          quiz_id: user.quizId,
          user_name: user.username,
          is_submitted: false
        })),
        skipDuplicates: true,
      });
    },
    updateUserQuizesList: async (prismaInstance: PrismaClient, userData: any) => {
      return await prismaInstance.userQuiz.updateMany({
        where: {
          user_name: userData.username,
          quiz_id: userData.quizId
        },
        data: {
          is_submitted : userData.is_submitted
        },
      });
    },
}

export default userQuizRepository;
