import express from "express";
var router = express.Router();
import userController from "./userAnswerController";
import validate from "../../middlewares/validate";
import { createUserAnswers } from "./userAnswerSchema";

router.post('/answer',validate(createUserAnswers), userController.handleCreateUserQuizQuestion);

export default router;
