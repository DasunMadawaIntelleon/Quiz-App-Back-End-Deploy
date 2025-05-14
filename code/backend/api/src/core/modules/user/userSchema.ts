import { z } from "zod";
import { AnswerEnum } from "../../utils/schema/enums/enumTypes";

  const getUser = z.object({
    params: z.object({
        username: z.string().min(6, "Username is required")
    })
  });

  const createUser = z.object({
    body: z.object({
        username: z.string().min(6, "Username must be at least 8 characters"),
        password: z.string().min(6, "Password must be at least 8 characters")
          .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
          .regex(/[0-9]/, "Password must contain at least one number"),
        name: z.string().optional()
    })
  });

  const createRandomUser = z.object({
    body: z.object({
      userList: z.array(
        z.object({
          username: z.string().min(6, "Username must be at least 8 characters"),
          password: z.string().min(6, "Password must be at least 8 characters")
        })
      ),
      quizId: z.string().min(1, "quiz_id is required"),
    })
  });

  const updateUser = z.object({
    params: z.object({
        username: z.string().min(6, "Username is required")
    }),
    body: z.object({
        name: z.string().optional(),
        password: z.string().min(6, "Password must be at least 8 characters")
    })
  });

  const deleteUser = z.object({
    params: z.object({
        username: z.string().min(2, "Username is required")
    })
  });

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
    getUser,
    createUser,
    updateUser,
    deleteUser,
    createRandomUser,
    createUserAnswers
};