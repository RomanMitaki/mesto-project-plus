/* eslint-disable consistent-return */
import { Request, Response, NextFunction } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { ITempUserReq } from '../middleware/tempUserReq';
import User from '../models/user';
import CustomErrors from '../error';

class UserController {
  static async login(req: ITempUserReq, res: Response, next: NextFunction) {
    const { email, password } = req.body;
    try {
      const user = await User.findUserByCredentials(email, password);
      return res.send({
        token: jwt.sign({ _id: user._id }, 'some-secret-key', { expiresIn: '7d' }),
      });
    } catch {
      next(CustomErrors.internalServerError('Ошибка на стороне сервера'));
    }
  }

  static async createUser(req: Request, res: Response, next: NextFunction) {
    const {
      name, about, avatar, password, email,
    } = req.body;
    try {
      if (!email || !password) {
        return next(CustomErrors.badRequest('Переданы некорректные данные при создании пользователя'));
      }
      const testEmail = await User.findOne({ email });
      if (testEmail) {
        return next(CustomErrors.badRequest('Пользователь с переданным email уже существует'));
      }
      const hashPassword = await bcrypt.hash(password, 10);
      const user = await User.create({
        name, about, avatar, email, password: hashPassword,
      });
      return res.send({
        data:
          {
            name: user.name,
            about: user.about,
            avatar: user.avatar,
            email: user.email,
            password: user.password,
          },
      });
    } catch (error: any) {
      if (error.name === 'ValidationError') {
        next(CustomErrors.badRequest('Переданы некорректные данные при создании пользователя'));
      }
      next(CustomErrors.internalServerError('Ошибка на стороне сервера'));
    }
  }

  static async getUsers(req: Request, res: Response, next: NextFunction) {
    try {
      const users = await User.find({});
      return res.send({ data: users });
    } catch {
      next(CustomErrors.internalServerError('Ошибка на стороне сервера'));
    }
  }

  static async getUserById(req: Request, res: Response, next: NextFunction) {
    const { userId } = req.params;

    try {
      const user = await User.findById(userId);
      if (!user) {
        return next(CustomErrors.notFound('Пользователь по указанному _id не найден'));
      }
      return res.send({ data: user });
    } catch (error: any) {
      if (error.name === 'CastError') {
        next(CustomErrors.badRequest('Пользователь по указанному _id не найден'));
      }
      next(CustomErrors.internalServerError('Ошибка на стороне сервера'));
    }
  }

  static async updateInfo(req: ITempUserReq, res: Response, next: NextFunction) {
    const { name, about } = req.body;
    const id = req.user!._id;
    try {
      if (!name || !about) {
        return next(
          CustomErrors.badRequest(
            'Переданы некорректные данные при обновлении профиля',
          ),
        );
      }

      const user = await User.findByIdAndUpdate(
        id,
        {
          name,
          about,
        },
        {
          new: true,
          runValidators: true,
        },
      );
      if (!user) {
        return next(
          CustomErrors.notFound('Пользователь по указанному _id не найден'),
        );
      }
      return res.send({ data: user });
    } catch (error: any) {
      if (error.name === 'ValidationError') {
        next(CustomErrors.badRequest('Переданы некорректные данные при обновлении профиля'));
      }
      next(CustomErrors.internalServerError('Ошибка на стороне сервера'));
    }
  }

  static async updateAvatar(req: ITempUserReq, res: Response, next: NextFunction) {
    const { avatar } = req.body;
    const id = req.user!._id;
    try {
      if (!avatar) {
        return next(
          CustomErrors.badRequest(
            'Переданы некорректные данные при обновлении аватара',
          ),
        );
      }
      const user = await User.findByIdAndUpdate(
        id,
        {
          avatar,
        },
        {
          new: true,
          runValidators: true,
        },
      );
      if (!user) {
        return next(
          CustomErrors.notFound('Пользователь по указанному _id не найден'),
        );
      }
      return res.send({ data: user });
    } catch (error: any) {
      if (error.name === 'ValidationError') {
        next(CustomErrors.badRequest('Переданы некорректные данные при обновлении аватара'));
      }
      next(CustomErrors.internalServerError('Ошибка на стороне сервера'));
    }
  }
}

export default UserController;
