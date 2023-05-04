import { Router } from 'express';
import {
  createCard, getCards, likeCard, dislikeCard, deleteCard,
} from '../controllers/cardController';
import { validateCreateCard, validateCardId } from '../models/card';

const cardRouter = Router();

cardRouter.post('/cards', validateCreateCard, createCard);
cardRouter.get('/cards', getCards);
cardRouter.delete('/cards/:cardId', validateCardId, deleteCard);
cardRouter.put('/cards/:cardId/likes', likeCard);
cardRouter.delete('/cards/:cardId/likes', dislikeCard);

export default cardRouter;
