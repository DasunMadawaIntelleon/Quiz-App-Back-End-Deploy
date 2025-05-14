import { Request, Response, NextFunction } from 'express';
import userService from './userService';

const userController = {
  handleAllUsers: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const data = await userService.getAllUsers();
      res.status(200).json({ message: "Users retrieved successfully", data: data });
    } catch (error) {
      next(error);
    }
  },
  handleGetUserByUsername: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const username = req.params.username;
      const data = await userService.getUserByUsername(username);
      res.status(200).json({ message: "User retrieved successfully", data: data });
    } catch (error) {
      next(error);
    }
  },
  handleCreateUser: async function (req: Request, res: Response, next: NextFunction) {
    try {
      await userService.createUser(req.body);
      res.status(201).json({ message: "User created successfully" });
    } catch (error) {
      next(error);
    }
  },
  handleGenerateRandomUserList: async function (req: Request, res: Response, next: NextFunction) {
    try {
       const uniqueIds = await userService.generateRandomUserList(req.params.number)
       res.status(200).json({ message: "Users generate successfully",data:uniqueIds });
    } catch (error) {
      next(error);
    }
  },
  handleCreateRandomUserList: async function (req: Request, res: Response, next: NextFunction) {
    try {
      await userService.createRandomUserList(req.body);
      res.status(201).json({ message: "Random Users created successfully" }); 
    } catch (error) {
      next(error);
    }
  },
  handleUpdateUser: async function (req: Request, res: Response, next: NextFunction) {
    try {
      await userService.updateUser(req.params.username, req.body);
      res.status(204).json({ message: "User updated successfully" });
    } catch (error) {
      next(error);
    }
  },
  handleDeleteUser: async function (req: Request, res: Response, next: NextFunction) {
    try {
      const id = req.params.username;
      await userService.deleteUser(id);
      res.status(204).json({ message: "User deleted successfully" });
    } catch (error) {
      next(error);
    }
  },
}
export default userController;