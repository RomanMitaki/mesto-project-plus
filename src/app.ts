/* eslint-disable no-console */
import express from 'express';
import mongoose from 'mongoose';
import userController from './controllers/userController';

const PORT = process.env.PORT || 3000;

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.post('/signup', userController.createUser);

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
