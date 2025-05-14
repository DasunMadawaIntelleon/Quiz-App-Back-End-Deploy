import { z } from "zod";

const getQuiz = z.object({
    params: z.object({
        id: z.string().min(2, "id is required")
    })
  });

const getAnalyseQuiz = z.object({
    params: z.object({
        id: z.string().min(2, "id is required")
    })
 });

const createQuiz = z.object({
    body: z.object({
        id: z.string().min(1, "id is required"),
        start_date_time: z.string().refine((date:any) => !isNaN(Date.parse(date)), {
            message: "Start DateTime must be a valid ISO 8601 string",
        }),
        end_date_time: z.string().refine((date:any) => !isNaN(Date.parse(date)), {
            message: "End DateTime must be a valid ISO 8601 string",
        }),
        description: z.string().min(1, "Description cannot be empty"),
        estimated_count: z.number().int().min(0, "Estimated count must be a non-negative integer"),
        quizQuestion: z.array(z.object({
            question_number: z.number().int().min(0, "question_number is required"),
            questionId: z.string().min(1, "question id is required")
        })),
    })
});

const updateQuiz = z.object({
    params: z.object({
        id: z.string().min(2, "id is required")
    }),
    body: z.object({
        start_date_time: z.string().refine((date:any) => !isNaN(Date.parse(date)), {
            message: "Start DateTime must be a valid ISO 8601 string",
        }),
        end_date_time: z.string().refine((date:any) => !isNaN(Date.parse(date)), {
            message: "End DateTime must be a valid ISO 8601 string",
        }),
        description: z.string().min(1, "Description cannot be empty"),
        estimated_count: z.number().int().min(0, "Estimated count must be a non-negative integer"),
        quizQuestion: z.array(z.object({
            questionId: z.string().min(1, "question id is required")
        })),
    })
  });

const deleteQuiz = z.object({
    params: z.object({
        id: z.string().min(2, "id is required")
    })
});

export{
    getQuiz,
    getAnalyseQuiz,
    createQuiz,
    updateQuiz,
    deleteQuiz
};