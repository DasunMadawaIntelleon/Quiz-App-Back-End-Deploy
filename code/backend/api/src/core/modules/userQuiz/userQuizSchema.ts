import { z } from "zod";

const getUsers = z.object({
    params: z.object({
        quizId: z.string().min(2, "Quiz ID is required")
    })
});

const getQuestions = z.object({
    params: z.object({
        quizId: z.string().min(2, "Quiz ID is required")
    })
});

const getQuizez = z.object({
    params: z.object({
        username: z.string().min(2, "Username is required")
    })
});

const createUserQuiz = z.object({
    body: z.array(
        z.object({
            quizId: z.string().min(1, "Quiz ID is required"),
            username: z.string().min(6, "Username is required")
        })
      ),
});

const deleteUserQuiz = z.object({
    body:z.object({
        quizId: z.string().min(1, "Quiz ID is required"),
        username: z.string().min(8, "Username is required")
    })
});

export {
    getUsers,
    getQuizez,
    createUserQuiz,
    deleteUserQuiz,
    getQuestions
};