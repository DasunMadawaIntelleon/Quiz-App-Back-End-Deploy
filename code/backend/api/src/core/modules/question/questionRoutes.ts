import express from "express";
var router = express.Router();
import questionController from "./questionController";
import validate from "../../middlewares/validate";
import { getQuestion, createQuestion, updateQuestion, deleteQuestion, inactiveQuestion, questionAttempts } from "./questionSchema";

router.get("/", questionController.handleAllQuestions);
router.get("/getall/active", questionController.handleAllActiveQuestions);
router.get("/:id",validate(getQuestion), questionController.handleGetQuestionById);
router.get("/attempts/:questionId",validate(questionAttempts), questionController.handleGetQuestionAttempts);
router.post("/",validate(createQuestion), questionController.handleCreateQuestion);
router.put("/:id",validate(updateQuestion), questionController.handleUpdateQuestion);
router.delete("/:id",validate(deleteQuestion), questionController.handleDeleteQuestion);
router.put('/inactive/:id',validate(inactiveQuestion),questionController.handleUpdateInactiveQuestion);

export default router;
