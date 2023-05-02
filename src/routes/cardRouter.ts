import { Router } from 'express';
import CardController from '../controllers/cardController';
import { validateCreateCard, validateCardId } from '../models/card';

const cardRouter = Router();

cardRouter.post('/cards', validateCreateCard, CardController.createCard);
cardRouter.get('/cards', CardController.getCards);
cardRouter.delete('/cards/:cardId', validateCardId, CardController.deleteCard);
cardRouter.put('/cards/:cardId/likes', CardController.likeCard);
cardRouter.delete('/cards/:cardId/likes', CardController.dislikeCard);

export default cardRouter;
