import { Router } from 'express';
import userController from '../controllers/userController';

const userRouter = Router();

userRouter.post('/users', userController.createUser);
userRouter.get('/users', userController.getUsers);
userRouter.get('/users/:userId', userController.getUserById);
userRouter.patch('/users/me', userController.updateInfo);
userRouter.patch('/users/me/avatar', userController.updateAvatar);

export default userRouter;
