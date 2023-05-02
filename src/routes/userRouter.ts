import { Router } from 'express';
import UserController from '../controllers/userController';

const userRouter = Router();

userRouter.get('/users', UserController.getUsers);
userRouter.get('/users/me', UserController.getUserInfo);
userRouter.get('/users/:userId', UserController.getUserById);
userRouter.patch('/users/me', UserController.updateInfo);
userRouter.patch('/users/me/avatar', UserController.updateAvatar);

export default userRouter;
