import { Request, Response, NextFunction } from "express";
import quizService from "./quizService";

const quizController = {
  handleAllQuizzes: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const data = await quizService.getAllQuizzes();
      res.status(200).json({ message: "Quiz retrieved successfully", data: data });
    } catch (error) {
      next(error);
    }
  },
  handleAllQuizzesDates: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const data = await quizService.getAllQuizzesDate();
      res.status(200).json({ message: "Quizzes Date retrieved successfully", data: data });
    } catch (error) {
      next(error);
    }
  },
  handleGetQuizById: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const id = req.params.id;
      const {quiz} = await quizService.getQuizById(id);
      res.status(200).json({ message: "Quiz retrieved successfully", data: quiz});
    } catch (error) {
      next(error);
    }
  },
  handleCreateQuiz: async function (req: Request, res: Response, next: NextFunction) {
    try {
      await quizService.createQuiz(req.body);
      res.status(201).json({ message: "Quiz created successfully" });
    } catch (error) {
      next(error);
    }
  },
  handleUpdateQuiz: async function (req: Request, res: Response, next: NextFunction) {
    try {
      console.log(req.body)
      await quizService.updateQuiz(req.params.id, req.body);
      res.status(204).json({ message: "Quiz updated successfully" });
    } catch (error) {
      next(error);
    }
  },
  handleDeleteQuiz: async function (req: Request, res: Response, next: NextFunction) {
    try {
      const id = req.params.id;
      await quizService.deleteQuiz(id);
      res.status(204).send({ message: "Quiz deleted successfully" });
    } catch (error) {
      next(error);
    }
  },
};
export default quizController;
