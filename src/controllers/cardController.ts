import { Request, Response, NextFunction } from 'express';
import { ITempUserReq } from '../middleware/tempUserReq';
import CustomErrors from '../error';
import Card from '../models/card';

class CardController {
  async createCard(req: ITempUserReq, res: Response, next: NextFunction) {
    const { name, link } = req.body;
    const owner = req.user!._id;

    try {
      if (!name || !link || !owner) {
        return next(
          CustomErrors.badRequest(
            'Переданы некорректные данные при создании карточки',
          ),
        );
      }
      const card = await Card.create({ name, link, owner });
      return res.send({ data: card });
    } catch {
      next(CustomErrors.internalServerError('Ошибка на стороне сервера'));
    }
  }

  async getCards(req: Request, res: Response, next: NextFunction) {
    try {
      const cards = await Card.find({});
      return res.send({ data: cards });
    } catch {
      next(CustomErrors.internalServerError('Ошибка на стороне сервера'));
    }
  }

  async deleteCard(req: ITempUserReq, res: Response, next: NextFunction) {
    const { cardId } = req.params;

    try {
      await Card.findByIdAndRemove(cardId).then((card) => {
        if (!card) {
          return next(
            CustomErrors.notFound('Карточка с указанным _id не найдена'),
          );
        }
        return res.send({ data: card });
      });
    } catch {
      next(CustomErrors.internalServerError('Ошибка на стороне сервера'));
    }
  }

  async likeCard(req: ITempUserReq, res: Response, next: NextFunction) {
    const { cardId } = req.params;
    const id = req.user!._id;

    try {
      if (!cardId) {
        return next(
          CustomErrors.badRequest(
            'Переданы некорректные данные для постановки лайка',
          ),
        );
      }
      const card = await Card.findByIdAndUpdate(
        cardId,
        {
          $addToSet: {
            likes: id,
          },
        },
        {
          new: true,
        },
      );
      if (!card) {
        return next(
          CustomErrors.notFound('Передан несуществующий _id карточки'),
        );
      }
      return res.send({ data: card });
    } catch {
      next(CustomErrors.internalServerError('Ошибка на стороне сервера'));
    }
  }

  async dislikeCard(req: ITempUserReq, res: Response, next: NextFunction) {
    const { cardId } = req.params;
    const id = req.user!._id;

    try {
      if (!cardId) {
        return next(
          CustomErrors.badRequest(
            'Переданы некорректные данные для снятия лайка',
          ),
        );
      }
      const card = await Card.findByIdAndUpdate(
        cardId,
        {
          $pull: {
            likes: id,
          },
        },
        {
          new: true,
        },
      );
      if (!card) {
        return next(
          CustomErrors.notFound('Передан несуществующий _id карточки'),
        );
      }
      return res.send({ data: card });
    } catch {
      next(CustomErrors.internalServerError('Ошибка на стороне сервера'));
    }
  }
}
export default new CardController();