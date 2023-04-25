import { Request, Response, NextFunction } from 'express';
import User from '../models/user';

class UserController {
  async createUser(req: Request, res: Response, next: NextFunction) {
    const {
      name = 'Жак-Ив Кусто',
      about = 'Исследователь',
      avatar = 'https://pictures.s3.yandex.net/resources/jacques-cousteau_1604399756.png',
    } = req.body;

    try {
      const user = await User.create({
        name, about, avatar,
      });
      return res.send({
        data:
          {
            name: user.name,
            about: user.about,
            avatar: user.avatar,
          },
      });
    } catch (e) {
      console.log(e);
    }
  }
}

export default new UserController();
