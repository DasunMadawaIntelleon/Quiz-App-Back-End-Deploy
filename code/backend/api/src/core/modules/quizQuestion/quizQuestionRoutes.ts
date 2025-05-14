import express from "express";
var router = express.Router();
import quizQuestionController from "./quizQuestionController";
import validate from "../../middlewares/validate";
import { quizQuestion, getQuestion, getQuiz } from "./quizQuestionSchema";

router.get('/:quizId',validate(getQuestion),quizQuestionController.handleQuizQuestion);
router.get('/quiz/:questionId',validate(getQuiz),quizQuestionController.handleQuizQuestionByQuestionId);
router.post('/',validate(quizQuestion),quizQuestionController.handleCreateQuizQuestion);
router.delete('/',validate(quizQuestion),quizQuestionController.handleDeleteQuizQuestion);

export default router;
