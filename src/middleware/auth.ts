import { Request, Response, NextFunction } from 'express';
import jwt, { JsonWebTokenError } from 'jsonwebtoken';
import AuthError from '../errors/authError';

export interface IAuthRequest extends Request {
  user?: string
}

interface IJwtPayload {
  _id: string
}

const getToken = (header: string) => header.replace('Bearer ', '');

// eslint-disable-next-line consistent-return
export default (req: IAuthRequest, res: Response, next: NextFunction) => {
  let payload;
  try {
    const { authorization } = req.headers;

    if (!authorization || !authorization.startsWith('Bearer ')) {
      return next(new AuthError('Необходима авторизация'));
    }

    const token = getToken(authorization);

    payload = jwt.verify(token, 'qwerty') as IJwtPayload;
  } catch (error) {
    if (error instanceof JsonWebTokenError) {
      next(new AuthError('Необходима авторизация'));
    } else {
      next(error);
    }
  }

  req.user = payload?._id;

  next();
};
