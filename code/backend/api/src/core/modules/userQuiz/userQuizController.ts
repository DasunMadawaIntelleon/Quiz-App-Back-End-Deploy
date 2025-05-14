import { Request, Response, NextFunction } from 'express';
import userQuizService from './userQuizService';
const userQuizController = {
    handletUsersByQuizID: async(req: Request, res: Response, next: NextFunction) => {
        try {
            const quizId = req.params.quizId;
            const data = await userQuizService.getUserQuizesByQuizID(quizId);
            res.status(200).json({ message: "User Quizes retrieved successfully", data: data });
          } catch (error) {
            next(error);
        }
    },
    handletUserQuizQuestionsByQuizID: async(req: Request, res: Response, next: NextFunction) => {
        try {
            const quizId = req.params.quizId;
            const data = await userQuizService.getUserQuizeQuestionByQuizID(quizId);
            res.status(200).json({ message: "User Quiz Quesstions retrieved successfully", data: data });
          } catch (error) {
            next(error);
        }
    },

    handleQuizesByUserName: async (req: Request, res: Response, next: NextFunction) => {
        try {
            const username = req.params.username;
            const data = await userQuizService.getUserQuizesByUserName(username);
            res.status(200).json({ message: "User Quizes retrieved successfully", data: data });
          } catch (error) {
            next(error);
        }
    },

    handleCreateUserQuiz: async (req: Request, res: Response, next: NextFunction) => {
        try {
            await userQuizService.createUserQuiz(req.body);
            res.status(201).json({ message: "User Quiz created successfully" });
          } catch (error) {
            next(error);
        }
    },

    handleDeleteUserQuiz: async (req: Request, res: Response, next: NextFunction) => {
        try {
            const userData = req.body;
            await userQuizService.deleteUserQuiz(userData);
            res.status(204).send({ message: "User Quiz delete successfully" });
          } catch (error) {
            next(error);
        }
    },
};

export default userQuizController;