import { PrismaClient } from '@prisma/client';

const questionRepository = {

    getAllQuestions : async (prismaInstance: PrismaClient ) => {
        return await prismaInstance.question.findMany({
          include:{
            QuestionAnswer:true
          },
          orderBy: {
            id: 'asc' 
        }
        });
    },
    getAllActiveQuestions : async (prismaInstance: PrismaClient ) => {
      return await prismaInstance.question.findMany({
        where: {
          active: true
        },
      })
    },
    getQuestionById : async (prismaInstance: PrismaClient , id: string) => {
        return await prismaInstance.question.findUnique({
            where: {
                id: id,
            },
            include:{
              QuestionAnswer:true
            }
        });
    },
    getQuestionByQuestionIds : async (prismaInstance: PrismaClient , questionIds: any) => {
      return await prismaInstance.question.findMany({
        where: {
            id: {
                in: questionIds
            }
        },
        select: {
            id: true 
        }
    });
  },
  getQuestionByIdWithAnswers : async (prismaInstance: PrismaClient , id: string) => {
    return await prismaInstance.question.findUnique({
        where: {
            id: id,
        },
        include: {
          QuestionAnswer: true
        }
    });
  },
    createQuestion: async (prismaInstance: PrismaClient, questionData: any) => {
        return await prismaInstance.question.create({
          data: {
            id: questionData.id,
            question: questionData.question,
            a: questionData.a,
            b: questionData.b,
            c: questionData.c,
            d: questionData.d,
            active:true,
            question_type: questionData.question_type,
            section: questionData.section,
          },
        });
    },
    updateQuestion: async (prismaInstance: PrismaClient, id: string, questionData: any) => {
        return await prismaInstance.question.update({
            where: {
              id: id,
            },
            data: {
              question: questionData.question,
              a: questionData.a,
              b: questionData.b,
              c: questionData.c,
              d: questionData.d,
              active:questionData.active,
              question_type: questionData.question_type,
              section: questionData.section,
            },
          });
    },
    deleteQuestion: async (prismaInstance: PrismaClient, id: string) => {
        return await prismaInstance.question.delete({
            where: {
              id: id,
            },
          });
    },
}

export default questionRepository;