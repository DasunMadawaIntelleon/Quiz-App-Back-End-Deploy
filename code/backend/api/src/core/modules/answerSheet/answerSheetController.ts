import { Request, Response , NextFunction} from 'express';
import answerSheetService from './answerSheetService';

const answerSheetController = {
  handleGetIndividualAnswerSheets: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const username = req.params.username;
      const quizId = req.params.quizId;
      const data = await answerSheetService.getIndividualAnswerSheets(username , quizId);
      res.status(200).json({ message: "Individual Result retrieved successfully", data: data });
    } catch (error) {
      next(error);
    }
  },
  handleGetAnswerSheetByQuiz: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const id = req.params.quizId;
      const data = await answerSheetService.getAnswerSheetByQuiz(id);
      res.status(200).json({ message: "Individual Result retrieved successfully", data: data });
    } catch (error) {
      next(error);
    }
  },
  handleGetAnswerSheetByUsername: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const username = req.params.username;
      const data = await answerSheetService.getAnswerSheetByUsername(username);
      res.status(200).json({ message: "Individual Result retrieved successfully", data: data });
    } catch (error) {
      next(error);
    }
  },
  handleLatestQuiz: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const data = await answerSheetService.latestQuizResults()
      res.status(200).json({ message: "Quiz results retrieved successfully", data: data });
    } catch (error) {
      next(error);
    }
  },
  handleGetUserResult: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const username = req.params.username;
      const quizId = req.params.quizId;
      const data = await answerSheetService.getQuizResults(username,quizId)
      res.status(200).json({ message: "Quiz results retrieved successfully", data: data });
    } catch (error) {
      next(error);
    }
  },
}
export default answerSheetController;