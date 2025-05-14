import { PrismaClient } from '@prisma/client';
import { UserRole } from '../../config/constants';

const userRepository = {

    getUserByUsername : async (prismaInstance: PrismaClient , username: string) => {
        return await prismaInstance.user.findUnique({
            where: {
              user_name: username,
            },
        });
    },
    getAllUsers : async (prismaInstance: PrismaClient) => {
      return await prismaInstance.user.findMany({
        where: {
          role: UserRole.USER,
        },
        select: {
          id: true,
          user_name: true,
          name: true,
          role: true
        },
        orderBy: {
          id: 'desc' 
        }
      });
    },
    findUsersByUsername : async (prismaInstance: PrismaClient, usernameList:any) => {
        return await prismaInstance.user.findMany({
            where: {
              user_name: {
                in: usernameList
              }
            },
            select: {
              user_name: true 
            }
          });
    },
    createUser: async (prismaInstance: PrismaClient, userData: any) => {
        return await prismaInstance.user.create({
            data: {
                user_name: userData.username,
                name: userData.name,
                password: userData.password,
                role: userData.role,
            },   
        })
    },
    createUsersList: async (prismaInstance: PrismaClient, userList: any) => {
        return await prismaInstance.user.createMany({
            data:userList.map((user: { username: string; password: string; })=>({
              user_name: user.username,
              password: user.password,
              role: UserRole.USER,
            })),
            skipDuplicates: true,
          });
    },
    updateUser: async (prismaInstance: PrismaClient, username: string, userData: any) => {
        return await prismaInstance.user.update({
          where: {
            user_name: username,
          },
          data: {
            name: userData.name,
            password: userData.password, 
          },
        });
    },
    deleteUser: async (prismaInstance: PrismaClient, username: string) => {
        return await prismaInstance.user.delete({
            where: {
                user_name : username
            }
          });
    },
}

export default userRepository;