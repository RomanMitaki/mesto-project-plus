/* eslint-disable consistent-return */
import { Request, Response, NextFunction } from 'express';
import mongoose from 'mongoose';
import BadRequestError from '../errors/badRequestError';
import InternalServerError from '../errors/internalServerError';
import ForbiddenError from '../errors/forbiddenError';
import NotFoundError from '../errors/notFoundError';
import Card from '../models/card';
import { IAuthRequest } from '../middleware/auth';

class CardController {
  static async createCard(req: IAuthRequest, res: Response, next: NextFunction) {
    const { name, link } = req.body;
    const owner = req.user;

    try {
      const card = await Card.create({ name, link, owner });
      return res.send({ data: card });
    } catch (error) {
      if (error instanceof mongoose.Error.ValidationError && error.name === 'ValidationError') {
        next(new BadRequestError('Переданы некорректные данные при создании карточки'));
      } else {
        next(new InternalServerError('На сервере произошла ошибка'));
      }
    }
  }

  static async getCards(req: Request, res: Response, next: NextFunction) {
    try {
      const cards = await Card.find({});
      return res.send({ data: cards });
    } catch {
      next(new InternalServerError('На сервере произошла ошибка'));
    }
  }

  static async deleteCard(req: IAuthRequest, res: Response, next: NextFunction) {
    const { cardId } = req.params;
    const owner = req.user;

    try {
      const checkingCard = await Card.findById(cardId);
      if (checkingCard && checkingCard.owner.toString() !== owner) {
        return next(new ForbiddenError('Недостаточно прав для удаления карточки'));
      }
      const card = await Card.findByIdAndRemove(cardId);
      if (!card) {
        return next(new NotFoundError('Карточка с указанным _id не найдена'));
      }

      return res.send({ data: card });
    } catch (error) {
      if (error instanceof mongoose.Error.CastError && error.name === 'CastError') {
        next(new BadRequestError('Карточка с указанным _id не найдена'));
      } else {
        next(new InternalServerError('На сервере произошла ошибка'));
      }
    }
  }

  static async likeCard(req: IAuthRequest, res: Response, next: NextFunction) {
    const { cardId } = req.params;
    const id = req.user;

    try {
      const card = await Card.findByIdAndUpdate(
        cardId,
        {
          $addToSet: {
            likes: id,
          },
        },
        {
          new: true,
          runValidators: true,
        },
      );
      if (!card) {
        return next(new NotFoundError('Передан несуществующий _id карточки'));
      }
      return res.send({ data: card });
    } catch (error) {
      if (error instanceof mongoose.Error.CastError && error.name === 'CastError') {
        next(new BadRequestError('Передан несуществующий _id карточки'));
      } else {
        next(new InternalServerError('На сервере произошла ошибка'));
      }
    }
  }

  static async dislikeCard(req: IAuthRequest, res: Response, next: NextFunction) {
    const { cardId } = req.params;
    const id = req.user;

    try {
      const card = await Card.findByIdAndUpdate(
        cardId,
        {
          $pull: {
            likes: id,
          },
        },
        {
          new: true,
          runValidators: true,
        },
      );
      if (!card) {
        return next(new NotFoundError('Передан несуществующий _id карточки'));
      }
      return res.send({ data: card });
    } catch (error) {
      if (error instanceof mongoose.Error.CastError && error.name === 'CastError') {
        next(new BadRequestError('Передан несуществующий _id карточки'));
      } else {
        next(new InternalServerError('На сервере произошла ошибка'));
      }
    }
  }
}
export default CardController;
