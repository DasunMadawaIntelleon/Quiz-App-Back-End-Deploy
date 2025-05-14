import { z } from "zod";
import { AnswerEnum } from "../../utils/schema/enums/enumTypes";

  const createUserAnswers = z.object({
    body: z.object({
      next_number: z.number().int().min(0, "question number is required").optional(),
      question_number: z.number().int().min(0, "question number is required").optional(),
      username: z.string().min(6, "Username is required"),
      quizId: z.string().min(1, "quiz id is required"),
      questionId: z.string().min(1, "question id is required").optional(),
      userAnswers: z.array(AnswerEnum).optional(),
    })
  });

export {
    createUserAnswers
};