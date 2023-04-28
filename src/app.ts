/* eslint-disable no-console */
import express, { Request, Response, NextFunction } from 'express';
import mongoose from 'mongoose';
import userRouter from './routes/userRouter';
import cardRouter from './routes/cardRouter';
import CustomErrors from './error';
import { addTempUserReq } from './middleware/tempUserReq';
import errorHandler from './middleware/errorHadler';

const PORT = process.env.PORT || 3000;

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(addTempUserReq);

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
