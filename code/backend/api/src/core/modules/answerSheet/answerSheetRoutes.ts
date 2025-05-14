import express from "express";
var router = express.Router();
import answerSheetController from "./answerSheetController";
import validate from "../../middlewares/validate";
import {
  getAnswerSheetByQuiz,
  getAnswerSheetByUsername,
  getUserResults
} from "./answerSheetSchema";

router.get("/individualResult/:username/:quizId",validate(getUserResults) ,answerSheetController.handleGetIndividualAnswerSheets);
router.get("/getResultsByQuiz/:quizId",validate(getAnswerSheetByQuiz),answerSheetController.handleGetAnswerSheetByQuiz);
router.get("/getResultsByUser/:username",validate(getAnswerSheetByUsername),answerSheetController.handleGetAnswerSheetByUsername);
router.get("/latestResults", answerSheetController.handleLatestQuiz);
router.get("/getUserResult/:username/:quizId" ,validate(getUserResults), answerSheetController.handleGetUserResult);

export default router;