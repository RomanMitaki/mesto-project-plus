/* eslint-disable no-console */
import express from 'express';
import mongoose from 'mongoose';
import userRouter from './routes/userRouter';

const PORT = process.env.PORT || 3000;

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/', userRouter);

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
