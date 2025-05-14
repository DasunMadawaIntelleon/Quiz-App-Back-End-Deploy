import { PrismaClient } from '@prisma/client';

const quizRepository = {

    getAllQuizs : async (prismaInstance: PrismaClient) => {
        return await prismaInstance.quiz.findMany(
          {
            include:{
              QuizQuestion:true
            },
            orderBy: {
              id: 'desc' 
            }
          }
        );
    },
    getAllQuizBylist : async (prismaInstance: PrismaClient, quizIdList:any) => {
      return await prismaInstance.quiz.findMany({
        where: {
          id: {
            in: quizIdList,
          }
        }
      });
  },
    getQuizById : async (prismaInstance: PrismaClient , id: string) => {
        return await prismaInstance.quiz.findUnique({
            where: {
                id: id,
            },
            include: {
              QuizQuestion: {
                include: {
                  Question: true,
                },
              },
              UserQuiz: {
                include: {
                  User: true,
                },
            },
          }
        });
    },
    getAllQuizzesDates : async (prismaInstance: PrismaClient) => {
      const quizzes = await prismaInstance.quiz.findMany({
        select: {
          start_date_time : true
        },
      });
  
      return quizzes.map(q => q.start_date_time); 
    },
    getQuizDateById : async (prismaInstance: PrismaClient, id: string) => {
      const quizData = await prismaInstance.quiz.findUnique({
        where: {
          id: id,
         },
        select: {
          end_date_time : true
        },
      });
  
      return quizData?.end_date_time;
    },
    getOnlyQuizById : async (prismaInstance: PrismaClient , id: string) => {
      return await prismaInstance.quiz.findUnique({
        where: {
          id: id,
        },
      });
    },
    getQuizByCurrentTime : async (prismaInstance: PrismaClient , id: string) => {
      return await prismaInstance.quiz.findUnique({
        where: {
          id: id,
          end_date_time : {}
        },
      });
    },
    getLatestQuiz: async (prisma: any) => {
      return await prisma.quiz.findMany({
        orderBy: {
            end_date_time: 'desc' 
        }
      });
    },
    createQuiz: async (prismaInstance: PrismaClient, quizData: any) => {
        return await prismaInstance.quiz.create({
          data: {
            id: quizData.id,         
            start_date_time: quizData.start_date_time, 
            end_date_time: quizData.end_date_time, 
            description: quizData.description,     
            estimated_count: quizData.estimated_count,
            is_visible:quizData.is_visible
          },
        })
    },
    updateQuiz: async (prismaInstance: PrismaClient, id: string, quizData: any) => {
        return await prismaInstance.quiz.update({
          where: {
            id: id,
          },
          data: {
            start_date_time: quizData.start_date_time, 
            end_date_time: quizData.end_date_time, 
            description: quizData.description,     
            estimated_count: quizData.estimated_count,
            is_visible:quizData.is_visible
          },
        });
    },
    deleteQuiz: async (prismaInstance: PrismaClient, id: string) => {
        return await prismaInstance.quiz.delete({
            where: {
              id: id,
            },
          });
    },
}

export default quizRepository;