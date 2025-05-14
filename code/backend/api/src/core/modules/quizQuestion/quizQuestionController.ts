import { Request, Response, NextFunction } from "express";
import quizQuestionService from "./quizQuestionService";
const quizQuestionController = {
  handleQuizQuestion: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const quizId = req.params.quizId;
      const data = await quizQuestionService.getQuizQuestionByQuizId(quizId);
      res.status(200).json({ message: "Quiz question fetched successfully", data: data });
    } catch (error) {
      next(error);
    }
  },
  handleQuizQuestionByQuestionId: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const questionId = req.params.questionId;
      const data = await quizQuestionService.getQuizListByQuestionId(questionId);
      res.status(200).json({ message: "Quiz fetched successfully", data: data });
    } catch (error) {
      next(error);
    }
  },
  handleCreateQuizQuestion: async (req: Request, res: Response, next: NextFunction) => {
    try {
      await quizQuestionService.createQuizQuestion(req.body);
      res.status(201).json({ message: "Quiz question created successfully" });
    } catch (error) {
      next(error);
    }
  },
  handleDeleteQuizQuestion: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userData = req.body;
      await quizQuestionService.deleteQuizQuestion(userData);
      res.status(204).send({ message: "Quiz question deleted successfully" });
    } catch (error) {
      next(error);
    }
  },
}
export default quizQuestionController;