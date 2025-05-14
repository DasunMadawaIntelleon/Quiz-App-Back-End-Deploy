import express from "express";
var router = express.Router();
import authController from "./authController";
import validate from "../../middlewares/validate";
import {
  authSignIn,
  refreshToken,
} from "./authSchema";

router.post("/login",validate(authSignIn), authController.handleSignIn);
router.post("/token",validate(refreshToken),authController.handleRefreshToken);
router.post('/logout', authController.handleLogOut);

export default router;
