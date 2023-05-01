/* eslint-disable no-console */
import express, { Request, Response, NextFunction } from 'express';
import mongoose from 'mongoose';
import rateLimit from 'express-rate-limit';
import helmet from 'helmet';
import auth from './middleware/auth';
import userRouter from './routes/userRouter';
import cardRouter from './routes/cardRouter';
import UserController from './controllers/userController';
import CustomErrors from './error';
import { addTempUserReq } from './middleware/tempUserReq';
import errorHandler from './middleware/errorHadler';

const PORT = process.env.PORT || 3000;

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per `window` (here, per 15 minutes)
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
});

const app = express();
app.use(helmet());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(limiter);
app.use(addTempUserReq);

app.post('/signin', UserController.login);
app.post('/signup', UserController.createUser);
app.use(auth);

app.use('/', cardRouter);
app.use('/', userRouter);
app.use((req: Request, res: Response, next: NextFunction) => {
  next(CustomErrors.notFound('Запрашиваемый ресурс не найден'));
});

app.use(errorHandler);

const start = async () => {
  try {
    await mongoose.connect('mongodb://localhost:27017/mestodb');

    app.listen(
      PORT,
      () => console.log(`Server start ${PORT}`),
    );
    mongoose.connection.db.listCollections().toArray((err, names) => {
      console.log(names);
    });
  } catch (e) {
    console.log(e);
  }
};

start();
