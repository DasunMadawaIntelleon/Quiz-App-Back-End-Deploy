import { PrismaClient } from '@prisma/client';
import { Answer } from '@prisma/client';

const questionAnswerRepository = {

    getQuestionAnswersByQuestionId : async (prismaInstance: PrismaClient , id: string) => {
      return await prismaInstance.questionAnswer.findMany({
        where: {
          question_id: id
        }
      });
    },
    createQuestionAnswer: async (prismaInstance: PrismaClient, questionAnswers: any) => {
        return await prismaInstance.questionAnswer.createMany({
          data: questionAnswers.map((questionAnswer: { question_id: string; answer: string; }) => ({
            question_id: questionAnswer.question_id,
            answer: questionAnswer.answer,
          })),
          skipDuplicates: true, 
        });
    },
    updateQuestionAnswer: async (prismaInstance: PrismaClient, questionAnswers: any) => {
        return await prismaInstance.$transaction(
          questionAnswers.map((questionAnswer: { id: string; answer: string }) =>
            prismaInstance.questionAnswer.updateMany({
              where: {
                question_id: questionAnswer.id,
              },
              data: {
                answer: questionAnswer.answer as Answer,
              },
            })
          )
        );
    },
    deleteQuestionAnswer: async (prismaInstance: PrismaClient, id: string) => {
      return await prismaInstance.questionAnswer.deleteMany({
        where: { question_id: id },
      });
  },
}

export default questionAnswerRepository;