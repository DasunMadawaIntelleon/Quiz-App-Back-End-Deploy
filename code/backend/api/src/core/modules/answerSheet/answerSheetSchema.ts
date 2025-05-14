import { z } from "zod";

const getAnswerSheetByQuiz = z.object({
    params: z.object({
        quizId: z.string().min(1, "quiz id is required")
    })
});

const getAnswerSheetByUsername = z.object({
    params: z.object({
        username: z.string().min(1, "user id is required")
    })
});

const getUserResults = z.object({
    params: z.object({
        username: z.string().min(1, "user id is required"),
        quizId: z.string().min(1, "quiz id is required")
    })
});

export{
    getAnswerSheetByQuiz,
    getAnswerSheetByUsername,
    getUserResults
  };