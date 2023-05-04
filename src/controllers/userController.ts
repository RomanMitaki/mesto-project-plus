/* eslint-disable consistent-return */
import { Request, Response, NextFunction } from 'express';
import mongoose from 'mongoose';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { IAuthRequest } from '../middleware/auth';
import User from '../models/user';
import BadRequestError from '../errors/badRequestError';
import ConflictError from '../errors/conflictError';
import InternalServerError from '../errors/internalServerError';
import NotFoundError from '../errors/notFoundError';

export const login = async (req: Request, res: Response, next: NextFunction) => {
  const { email, password } = req.body;
  try {
    const user = await User.findUserByCredentials(email, password);
    const token = jwt.sign({ _id: user._id }, 'qwerty', { expiresIn: '7d' });
    return res
      .cookie('jwt', token, {
        maxAge: 3600000 * 24 * 7,
        httpOnly: true,
      })
      .end();
  } catch (error) {
    next(error);
  }
};

export const getUserInfo = async (req: IAuthRequest, res: Response, next: NextFunction) => {
  const _id = req.user;
  try {
    const user = await User.findById(_id);
    res.send({ data: user });
  } catch (error) {
    next(error);
  }
};

export const createUser = async (req: Request, res: Response, next: NextFunction) => {
  const {
    name, about, avatar, password, email,
  } = req.body;
  try {
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
          },
    });
  } catch (error) {
    if (error instanceof mongoose.Error.ValidationError && error.name === 'ValidationError') {
      next(new BadRequestError('Переданы некорректные данные при создании пользователя'));
    } else if (error instanceof Error && error.name === 'MongoServerError') {
      next(new ConflictError('Пользователь с переданным email уже существует'));
    } else {
      next(new InternalServerError('На сервере произошла ошибка'));
    }
  }
};

export const getUsers = async (req: IAuthRequest, res: Response, next: NextFunction) => {
  try {
    const users = await User.find({});
    return res.send({ data: users });
  } catch {
    next(new InternalServerError('На сервере произошла ошибка'));
  }
};

export const getUserById = async (req: Request, res: Response, next: NextFunction) => {
  const { userId } = req.params;

  try {
    const user = await User.findById(userId);
    if (!user) {
      return next(new NotFoundError('Пользователь по указанному _id не найден'));
    }
    return res.send({ data: user });
  } catch (error) {
    if (error instanceof mongoose.Error.CastError && error.name === 'CastError') {
      next(new BadRequestError('Пользователь по указанному _id не найден'));
    } else {
      next(new InternalServerError('На сервере произошла ошибка'));
    }
  }
};

export const updateInfo = async (req: IAuthRequest, res: Response, next: NextFunction) => {
  const { name, about } = req.body;
  const id = req.user;
  try {
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
      return next(new NotFoundError('Пользователь по указанному _id не найден'));
    }
    return res.send({ data: user });
  } catch (error) {
    if (error instanceof mongoose.Error.ValidationError && error.name === 'ValidationError') {
      next(new BadRequestError('Переданы некорректные данные при обновлении профиля'));
    } else {
      next(new InternalServerError('На сервере произошла ошибка'));
    }
  }
};

export const updateAvatar = async (req: IAuthRequest, res: Response, next: NextFunction) => {
  const { avatar } = req.body;
  const id = req.user;
  try {
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
      return next(new NotFoundError('Пользователь по указанному _id не найден'));
    }
    return res.send({ data: user });
  } catch (error) {
    if (error instanceof mongoose.Error.ValidationError && error.name === 'ValidationError') {
      next(new BadRequestError('Переданы некорректные данные при обновлении аватара'));
    } else {
      next(new InternalServerError('На сервере произошла ошибка'));
    }
  }
};
