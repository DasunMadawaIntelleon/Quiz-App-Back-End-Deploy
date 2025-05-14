import { Request, Response, NextFunction } from 'express';
import userService from './userAnswerService';

const userAnswerController = {
  handleCreateUserQuizQuestion: async function (req: Request, res: Response, next: NextFunction) {
    try {
      const token = req.headers["authorization"];
      const data = await userService.createUserQuizQuestion(req.body,token);
      res.status(201).json({ message: "UserQuizQuestion updated successfully", data: data});
    } catch (error) {
      next(error);
    }
  },
}
export default userAnswerController;