import { Router } from 'express';
import {
  updateAvatar, updateInfo, getUserInfo, getUsers, getUserById,
} from '../controllers/userController';
import { validateUpdateAvatar, validateUpdateInfo, validateGetUserById } from '../models/user';

const userRouter = Router();

userRouter.get('/users', getUsers);
userRouter.get('/users/me', getUserInfo);
userRouter.get('/users/:userId', validateGetUserById, getUserById);
userRouter.patch('/users/me', validateUpdateInfo, updateInfo);
userRouter.patch('/users/me/avatar', validateUpdateAvatar, updateAvatar);

export default userRouter;
