import express from "express";
var router = express.Router();
import quizController from "./quizController";
import validate from "../../middlewares/validate";
import { getQuiz, createQuiz, updateQuiz, deleteQuiz } from "./quizSchema";

router.get("/", quizController.handleAllQuizzes);
router.get("/dates", quizController.handleAllQuizzesDates);
router.get("/:id",validate(getQuiz), quizController.handleGetQuizById);
router.post("/",validate(createQuiz), quizController.handleCreateQuiz);
router.put("/:id",validate(updateQuiz), quizController.handleUpdateQuiz);
router.delete("/:id",validate(deleteQuiz), quizController.handleDeleteQuiz);

export default router;
