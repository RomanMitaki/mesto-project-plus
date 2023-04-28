import { Response, NextFunction, Request } from 'express';

export interface ITempUserReq extends Request {
  user?: {
    _id: string,
  };
}

export const addTempUserReq = (req: ITempUserReq, res: Response, next: NextFunction) => {
  req.user = {
    _id: '644826731a9522bc0c1d0251',
  };

  next();
};
