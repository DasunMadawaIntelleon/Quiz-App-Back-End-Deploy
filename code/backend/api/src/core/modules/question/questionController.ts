import { Request, Response, NextFunction } from 'express';
import questionService from "./questionService";
const questionController = {
  handleAllQuestions: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const data = await questionService.getAllQuestions();
      res.status(200).json({ message: "Questions retrieved successfully" , data : data});
    } catch (error) {
      next(error);
    }
  },
  handleAllActiveQuestions: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const data = await questionService.getAllActiveQuestions();
      res.status(200).json({ message: "Active Questions retrieved successfully" , data : data});
    } catch (error) {
      next(error);
    }
  },
  handleGetQuestionById: async (req: Request, res: Response, next: NextFunction) => {
      try {
        const id = req.params.id
        const data = await questionService.getQuestionById(id);
        res.status(200).json({ message: "Question retrieved successfully" , data : data});
      } catch (error) {
        next(error);
      }
  },
  handleGetQuestionAttempts: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const id = req.params.questionId;
      const data = await questionService.questionAttempts(id);
      res.status(200).json({ message: "Question retrieved successfully" , data : data});
    } catch (error) {
      next(error);
    }
  },
  handleUpdateInactiveQuestion: async (req: Request, res: Response, next: NextFunction) => {
    try{
      await questionService.updateInactiveQuestion(req.params.id);
      res.status(204).json({ message: "Question Inactive successfully" });
    }catch(error){
      next(error);
    }
  },
  handleCreateQuestion: async function (req: Request, res: Response, next: NextFunction) {
      try {
        await questionService.createQuestion(req.body);
        res.status(201).json({ message: "Question created successfully" });
      } catch (error) {
        next(error);
      }
  },
  handleUpdateQuestion: async function (req: Request, res: Response, next: NextFunction) {
    try {
      await questionService.updateQuestion(req.params.id,req.body);
      res.status(204).json({ message: "Question updated successfully" });
    } catch (error) {
      next(error);
    }
  },
  handleDeleteQuestion: async function (req: Request, res: Response, next: NextFunction) {
      try {
        const id = req.params.id;
        await questionService.deleteQuestion(id);
        res.status(204).send({message:"Question deleted successfully"});
      } catch (error) {
        next(error);
      }
  },
}
export default questionController;