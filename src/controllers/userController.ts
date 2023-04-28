/* eslint-disable consistent-return */
import { Request, Response, NextFunction } from 'express';
import { ITempUserReq } from '../middleware/tempUserReq';
import User from '../models/user';
import CustomErrors from '../error';

class UserController {
  static async createUser(req: Request, res: Response, next: NextFunction) {
    const { name, about, avatar } = req.body;
    try {
      if (!name || !about || !avatar) {
        return next(CustomErrors.badRequest('Переданы некорректные данные при создании пользователя'));
      }
      const user = await User.create({
        name, about, avatar,
      });
      return res.send({
        data:
          {
            name: user.name,
            about: user.about,
            avatar: user.avatar,
          },
      });
    } catch {
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
    } catch {
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
        },
      );
      if (!user) {
        return next(
          CustomErrors.notFound('Пользователь по указанному _id не найден'),
        );
      }
      return res.send({ data: user });
    } catch {
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
        },
      );
      if (!user) {
        return next(
          CustomErrors.notFound('Пользователь по указанному _id не найден'),
        );
      }
      return res.send({ data: user });
    } catch {
      next(CustomErrors.internalServerError('Ошибка на стороне сервера'));
    }
  }
}

export default UserController;
