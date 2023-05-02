import { Router } from 'express';
import UserController from '../controllers/userController';
import { validateUpdateAvatar, validateUpdateInfo, validateGetUserById } from '../models/user';

const userRouter = Router();

userRouter.get('/users', UserController.getUsers);
userRouter.get('/users/me', UserController.getUserInfo);
userRouter.get('/users/:userId', validateGetUserById, UserController.getUserById);
userRouter.patch('/users/me', validateUpdateInfo, UserController.updateInfo);
userRouter.patch('/users/me/avatar', validateUpdateAvatar, UserController.updateAvatar);

export default userRouter;
