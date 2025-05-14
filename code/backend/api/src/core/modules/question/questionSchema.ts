import { z } from 'zod';
import { QuestionTypeEnum, QuestionSectionEnum, AnswerEnum } from "../../utils/schema/enums/enumTypes";

const Answers = z.object({
  question_id: z.string().min(2, "Option A cannot be empty"),
  answer: AnswerEnum
});

const getQuestion = z.object({
    params: z.object({
        id: z.string().min(2, "id is required")
    })
  });

const createQuestion = z.object({
    body: z.object({
        id: z.string().min(1, "id is required"),
        question: z.string().min(1, "Question cannot be empty"),
        a: z.string().min(1, "Option A cannot be empty"),
        b: z.string().min(1, "Option B cannot be empty"),
        c: z.string().nullable().optional(),
        d: z.string().nullable().optional(),
        answer: z.array(Answers),
        question_type: QuestionTypeEnum,
        section: QuestionSectionEnum,
    })
});

  const updateQuestion = z.object({
    params: z.object({
        id: z.string().min(2, "id is required")
    }),
    body: z.object({
        question: z.string().min(1, "Question cannot be empty"),
        a: z.string().min(1, "Option A cannot be empty"),
        b: z.string().min(1, "Option B cannot be empty"),
        c: z.string().nullable().optional(),
        d: z.string().nullable().optional(),
        answer: z.array(Answers),
        question_type: QuestionTypeEnum,
        section: QuestionSectionEnum,
    })
  });

  const deleteQuestion = z.object({
    params: z.object({
      id: z.string().min(2, "id is required")
    })
  });

  const inactiveQuestion = z.object({
    params: z.object({
      id: z.string().min(2, "id is required")
    })
  });

  const questionAttempts = z.object({
    params: z.object({
      questionId: z.string().min(2, "id is required")
    })
  });

  export {
    getQuestion,
    createQuestion,
    updateQuestion,
    deleteQuestion,
    inactiveQuestion,
    questionAttempts
  };