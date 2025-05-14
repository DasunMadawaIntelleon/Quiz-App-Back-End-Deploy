import express from "express";
var router = express.Router();
import userController from "./userController";
import validate from "../../middlewares/validate";
import { getUser,createUser,updateUser,deleteUser,createRandomUser } from "./userSchema";

router.get('/', userController.handleAllUsers);
router.get('/:username',validate(getUser), userController.handleGetUserByUsername);
router.get('/random/:number', userController.handleGenerateRandomUserList);
router.post('/',validate(createUser), userController.handleCreateUser);
router.post('/random',validate(createRandomUser), userController.handleCreateRandomUserList);
router.put('/:username',validate(updateUser), userController.handleUpdateUser);
router.delete('/:username',validate(deleteUser), userController.handleDeleteUser);

export default router;
