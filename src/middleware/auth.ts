import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import CustomErrors from '../error';

export interface IAuthRequest extends Request {
  user?: string
}

interface IJwtPayload {
  _id: string
}

const getToken = (header: string) => header.replace('Bearer ', '');

// eslint-disable-next-line consistent-return
export default (req: IAuthRequest, res: Response, next: NextFunction) => {
  const { authorization } = req.headers;

  if (!authorization || !authorization.startsWith('Bearer ')) {
    throw CustomErrors.auth('Необходима авторизация');
  }

  const token = getToken(authorization);
  let payload;

  try {
    payload = jwt.verify(token, 'qwerty') as IJwtPayload;
  } catch (err) {
    return res
      .status(401)
      .send({ message: 'Необходима авторизация' });
  }

  req.user = payload._id;

  next();
};
