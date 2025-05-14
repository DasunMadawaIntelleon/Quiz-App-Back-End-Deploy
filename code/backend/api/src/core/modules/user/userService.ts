import userRepository from './userRepository';
import userQuizRepository from '../userQuiz/userQuizRepository';
import  {createPrismaClient}  from '../../database/prisma';
import userQuizQuestionRepository from '../userQuizQuestion/userQuizQuestionRepository';
import { createError, HttpStatus } from '../../middlewares/customErrorHandler';
import bcrypt from 'bcrypt';
import quizRepository from '../quiz/quizRepository';
import logger from '../../utils/logger';
const prismaInstance = createPrismaClient();

const userService = {
  getAllUsers: async () => {
    logger.info("Fetching all users");
   try{
        const user = await userRepository.getAllUsers(prismaInstance);
        if (!user || user.length === 0) {
          logger.warn("No users found");
          return [];
        }
        logger.info(`Fetched ${user.length} users`);
        return user;
    }catch(error){
        logger.error("Error fetching all users", { error });
        throw error;
    }
  },

  getUserByUsername: async (id: string) => {
    try{
        logger.info(`Fetching user by username: ${id}`);
        const user = await userRepository.getUserByUsername(prismaInstance,id);

        if (!user) {
          logger.warn(`User not found: ${id}`);
          throw createError(HttpStatus.NOT_FOUND, "User not found");
        }
        logger.info(`User fetched successfully: ${id}`);
        return user;
        
    }catch(error){
      logger.error(`Error fetching user by username: ${id}`, { error });
      throw error;
    }
  },

  createUser: async (userData: any) => {
    try {
        logger.info(`Creating user: ${userData.username}`);
        await prismaInstance.$transaction(async (prisma:any) => {
          const userExists = await userRepository.getUserByUsername(prisma,userData.username);
  
          if (userExists) {
            logger.warn(`User already exists: ${userData.username}`);
            throw createError(HttpStatus.CONFLICT, "User already exists");
          }
          const bcryptedPassword = await bcrypt.hash(userData.password, 10);

          userData.password = bcryptedPassword

          const createUser = await userRepository.createUser(prisma,userData)

          if(!createUser){
              logger.error('Failed to create user', { userData });
              throw createError(HttpStatus.BAD_REQUEST, "Invalid input provided");
          }
          logger.info(`User created successfully: ${userData.username}`);
        });
      } catch (error) {
        logger.error(`Error creating user: ${userData.username}`, {error});
        throw error;
      }
  },
  generateRandomUserList: async (value: string) => {
    logger.info(`Generating random user list with input value: ${value}`);
    try{
      const number = parseInt(value, 10);

      if (isNaN(number) || number <= 0) {
        logger.error("Invalid number provided for user list generation");
        throw createError(HttpStatus.BAD_REQUEST, "Please provide a valid positive number");
      }
      
      const uniqueIds = new Set();
      const uppercase = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
      const lowercase = 'abcdefghijklmnopqrstuvwxyz';
      const digits = '0123456789';
      const symbols = '@$&';
      const allCharacters = uppercase + lowercase + digits + symbols;
  
      while (uniqueIds.size < number) {
        let uniqueId = '';
        uniqueId += uppercase.charAt(Math.floor(Math.random() * uppercase.length));
        uniqueId += lowercase.charAt(Math.floor(Math.random() * lowercase.length));
        uniqueId += digits.charAt(Math.floor(Math.random() * digits.length));
        uniqueId += symbols.charAt(Math.floor(Math.random() * symbols.length));

        for (let i = 4; i < 8; i++) {
          uniqueId += allCharacters.charAt(Math.floor(Math.random() * allCharacters.length));
        }

        uniqueId = uniqueId.split('').sort(() => Math.random() - 0.5).join('');

        let password = '';
        password += uppercase.charAt(Math.floor(Math.random() * uppercase.length));
        password += lowercase.charAt(Math.floor(Math.random() * lowercase.length));
        password += digits.charAt(Math.floor(Math.random() * digits.length));
  

        for (let i = 4; i < 8; i++) {
          password += allCharacters.charAt(Math.floor(Math.random() * allCharacters.length));
        }

        const unique = await userRepository.getUserByUsername(prismaInstance,uniqueId);
        
        if(!unique){
          uniqueIds.add({
            user_name: uniqueId,
            password : password
          });
        }
      }
      logger.info(`Generated ${uniqueIds.size} unique users`);
      return Array.from(uniqueIds);
      
    }catch(error){
      logger.error("Error generating random user list", { error });
      throw error;
    }
  },
  createRandomUserList: async (userData: any) =>  {
    logger.info("Creating random user list");
    try {
      const userList = userData.userList;

      await prismaInstance.$transaction(async (prisma:any) => {

        const usernames = userList.map((user:any) => user.username);

        const existingUsers = await userRepository.findUsersByUsername(prisma,usernames)
      
        const existingUsernames = new Set(existingUsers.map(user => user.user_name));
      
        const duplicates = usernames.filter((username:any) => existingUsernames.has(username));
        if (duplicates.length > 0) {
          logger.warn(`Duplicate usernames found: ${duplicates}`);
          throw createError(HttpStatus.CONFLICT, "Username already exists");
        }
       
        const newList = await Promise.all(
          userList.map(async (user: any) => ({
            ...user,
            password: await bcrypt.hash(user.password, 10)
          }))
        );
        
        const createUser = await userRepository.createUsersList(prisma,newList)

        if (createUser.count === 0) {
          logger.error("Failed to create random user list");
          throw createError(HttpStatus.BAD_REQUEST, "Invalid input provided");
        }

        const existingQuiz = await quizRepository.getQuizById(prisma,userData.quizId)

        if (!existingQuiz) {
          logger.error(`Quiz not found with ID: ${userData.quizId}`);
          throw createError(HttpStatus.NOT_FOUND, "Quiz not found");
        }

        const createUserQuiz = await userQuizRepository.createUserQuizesList(prisma,userList)

        if (!createUserQuiz || createUserQuiz.count === 0) {
          logger.error("Failed to insert details into userQuiz table");
          throw createError(HttpStatus.BAD_REQUEST, "Invalid input provided");
        }
      });
      logger.info("Random user list and associated quizzes created successfully");
    } catch (error) {
      logger.error("Error during the creation of random user list or quizzes", { error });
      throw error;
    } 
  },
  updateUser: async (username: string, userData: any) => {
    logger.info(`Updating user: ${username}`);
    try {
        const userExists = await userRepository.getUserByUsername(prismaInstance,username);
  
          if (!userExists) {
            logger.warn(`User not found: ${username}`);
            throw createError(HttpStatus.NOT_FOUND, "User not found");
          }
          
          const compair = await bcrypt.compare(userData.password, userExists.password);
              if (!compair) {
                const bcryptedPassword = await bcrypt.hash(userData.password, 10);
                userData.password = bcryptedPassword;
              }else{
                userData.password = userExists.password;
              }
              
          const updateUser = await userRepository.updateUser(prismaInstance,username,userData);

          if(!updateUser){
            logger.error('Failed to update user', { username });
            throw createError(HttpStatus.BAD_REQUEST, "Invalid request data");
          }
          logger.info(`User updated successfully: ${username}`);
      } catch (error) {
        logger.error(`Error updating user: ${username}`, { error });
        throw error;
      }
  },

  deleteUser: async (username: string) => {
    logger.info(`Deleting user: ${username}`);
    try {
      await prismaInstance.$transaction(async (prisma:any) => {
          
          const userExists = await userRepository.getUserByUsername(prisma,username);
  
          if (!userExists) {
            logger.warn(`User not found: ${username}`);
            throw createError(HttpStatus.NOT_FOUND, "User not found");
          }

        const existingUserQuizQuestion = await userQuizQuestionRepository.findFirstUserQuizQuestionsByQuizId(prisma,username);

        if (existingUserQuizQuestion){
          logger.warn(`Cannot delete user, quiz activities found: ${username}`);
          throw createError(HttpStatus.BAD_REQUEST, "Can't delete this user because quiz was been done");
        }

        const existingUserQuiz = await userQuizRepository.getUserQuizesByUsername(prisma,username);

        if (existingUserQuiz.length > 0) {
          await userQuizRepository.deleteUserQuizesByUsername(prisma,username);
        }
        
        const deleteUser = await userRepository.deleteUser(prisma,username);

        if(!deleteUser){
          logger.error(`Failed to delete user: ${username}`);
          throw createError(HttpStatus.BAD_REQUEST, "Invalid request data");
        }
        logger.info(`User deleted successfully: ${username}`);
      });
    } catch (error) {
      logger.error(`Error deleteUser user: ${username}`, { error });
      throw error;
    }
  }
    
};

export default userService;
