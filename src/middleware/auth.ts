import { Request, Response, NextFunction } from 'express';
import jwt, { JwtPayload } from 'jsonwebtoken';
import CustomErrors from '../error';

interface IAuthRequest extends Request {
  user?: string | JwtPayload
}

const getToken = (header: string) => header.replace('Bearer ', '');

export default (req: IAuthRequest, res: Response, next: NextFunction) => {
  const { authorization } = req.headers;

  if (!authorization || !authorization.startsWith('Bearer ')) {
    throw CustomErrors.auth('Необходима авторизация');
  }

  const token = getToken(authorization);
  let payload;

  try {
    payload = jwt.verify(token, 'qwerty');
  } catch (err) {
    return res
      .status(401)
      .send({ message: 'Необходима авторизация' });
  }

  req.user = payload as { _id: JwtPayload };

  next();
};
