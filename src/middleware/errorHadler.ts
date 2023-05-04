import { Request, Response, NextFunction } from 'express';
import AuthError from '../errors/authError';
import BadRequestError from '../errors/badRequestError';
import ConflictError from '../errors/conflictError';
import ForbiddenError from '../errors/forbiddenError';
import InternalServerError from '../errors/internalServerError';
import NotFoundError from '../errors/notFoundError';

export default function errorHandler(
  err: AuthError
    | BadRequestError
    | ConflictError
    | ForbiddenError
    | InternalServerError
    | NotFoundError,
  req: Request,
  res: Response,
  // eslint-disable-next-line no-unused-vars
  next: NextFunction,
) {
  const { statusCode = 500, message } = err;

  res
    .status(statusCode)
    .send({
      message: statusCode === 500
        ? 'На сервере произошла ошибка'
        : message,
    });
}
