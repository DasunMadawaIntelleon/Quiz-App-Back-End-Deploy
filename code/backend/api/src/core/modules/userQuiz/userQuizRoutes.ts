import express from 'express';
var router = express.Router();
import userQuizController from './userQuizController';
import validate from "../../middlewares/validate";
import { getUsers, getQuizez,createUserQuiz,deleteUserQuiz, getQuestions } from './userQuizSchema';

router.get('/quiz/:quizId',validate(getUsers),userQuizController.handletUsersByQuizID);
router.get('/question/:quizId',validate(getQuestions),userQuizController.handletUserQuizQuestionsByQuizID);
router.get('/user/:username',validate(getQuizez),userQuizController.handleQuizesByUserName);
router.post('/',validate(createUserQuiz),userQuizController.handleCreateUserQuiz);
router.delete('/',validate(deleteUserQuiz),userQuizController.handleDeleteUserQuiz);

export default router;