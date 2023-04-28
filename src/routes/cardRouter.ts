import { Router } from 'express';
import CardController from '../controllers/cardController';

const cardRouter = Router();

cardRouter.post('/cards', CardController.createCard);
cardRouter.get('/cards', CardController.getCards);
cardRouter.delete('/cards/:cardId', CardController.deleteCard);
cardRouter.put('/cards/:cardId/likes', CardController.likeCard);
cardRouter.delete('/cards/:cardId/likes', CardController.dislikeCard);

export default cardRouter;
