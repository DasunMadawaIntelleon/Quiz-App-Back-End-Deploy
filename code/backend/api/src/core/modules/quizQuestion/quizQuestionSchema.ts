import { z } from "zod";

const getQuestion = z.object({
    params: z.object({
        quizId: z.string().min(2, "Quiz ID is required")
    })
});

const getQuiz = z.object({
    params: z.object({
        questionId: z.string().min(2, "Question ID is required")
    })
});

const quizQuestion = z.object({
    body: z.object({
        quizId: z.string().min(1, "quiz id is required"),
        questionId: z.string().min(1, "question id is required"),
        question_number: z.number().int().min(0, "question_number is required")
    })
});

export {
    quizQuestion,
    getQuestion,
    getQuiz
};