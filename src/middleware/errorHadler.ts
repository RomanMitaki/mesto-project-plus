import { Request, Response } from 'express';
import CustomErrors from '../error';

export default function errorHandler(err: CustomErrors, req: Request, res: Response) {
  const { statusCode = 500, message } = err;
  console.log(err);

  res
    .status(statusCode)
    .send({
      // проверяем статус и выставляем сообщение в зависимости от него
      message: statusCode === 500
        ? 'На сервере произошла ошибка'
        : message,
    });
}
