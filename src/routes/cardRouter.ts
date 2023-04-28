import { Router } from 'express';
import cardController from '../controllers/cardController';

const cardRouter = Router();

cardRouter.post('/cards', cardController.createCard);
cardRouter.get('/cards', cardController.getCards);
cardRouter.delete('/cards/:cardId', cardController.deleteCard);
cardRouter.put('/cards/:cardId/likes', cardController.likeCard);
cardRouter.delete('/cards/:cardId/likes', cardController.dislikeCard);

export default cardRouter;
