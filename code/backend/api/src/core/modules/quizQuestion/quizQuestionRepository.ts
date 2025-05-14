import { PrismaClient } from '@prisma/client';

const quizQuestionRepository = {

    getQuizQuestion : async (prismaInstance: PrismaClient , quiz_id: string, question_id:string) => {
        return await prismaInstance.quizQuestion.findMany({
            where: {
              quiz_id: quiz_id,
              question_id: question_id
            },
    });
    },
    getQuizQuestionsByQuestionId : async (prismaInstance: PrismaClient , id: string) => {
        return await prismaInstance.quizQuestion.findMany({
            where: {
              question_id: id,
            },
        });
    },
    getQuizQuestionsByQuizId : async (prismaInstance: PrismaClient , id: string) => {
        return await prismaInstance.quizQuestion.findMany({
            where: {
              quiz_id: id,
            },
        });
    },
    createQuizQuestionList: async (prismaInstance: PrismaClient,quizId:string, quizQuestionData: any) => {
        return await prismaInstance.quizQuestion.createMany({
          data: quizQuestionData.map((quizQuestion: { question_number: number; questionId: string; }) => ({
              quiz_id: quizId,
              question_id: quizQuestion.questionId,
              question_number:quizQuestion.question_number
          })),
          skipDuplicates: true,
        })
    },
    createQuizQuestion: async (prismaInstance: PrismaClient, quiz_id: string, question_id:string,question_number:number) => {
      return await prismaInstance.quizQuestion.create({
        data:{
          quiz_id: quiz_id,
          question_id: question_id,
          question_number: question_number
        },
      })
    },
    deleteQuizQuestionByQuestionId: async (prismaInstance: PrismaClient, id: string) => {
        return await prismaInstance.quizQuestion.deleteMany({
          where: {
            question_id: id
          }
        })
    },
    deleteQuizQuestionByQuizId: async (prismaInstance: PrismaClient, id: string) => {
      return await prismaInstance.quizQuestion.deleteMany({
        where: {
          quiz_id: id
        }
      })
    },
    deleteQuizQuestion: async (prismaInstance: PrismaClient, quizId: string, questionId:string) => {
      return await prismaInstance.quizQuestion.deleteMany({
        where: {
          quiz_id: quizId,
          question_id: questionId
        }
      })
    },
}

export default quizQuestionRepository;