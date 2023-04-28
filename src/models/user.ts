import { model, Schema } from 'mongoose';

const linkRegExp = /^(http(s):\/\/.)[-a-zA-Z0-9@:%._+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_+.~#?&//=]*)$/;

export interface IUser {
  name: string;
  about: string;
  avatar: string;
}

const userSchema = new Schema<IUser>({
  name: {
    type: String,
    minlength: 2,
    maxlength: 30,
    required: true,
  },
  about: {
    type: String,
    minlength: 2,
    maxlength: 200,
    required: true,

  },
  avatar: {
    type: String,
    required: true,
    validate: {
      validator: (v: string) => linkRegExp.test(v),
      message: 'Некорректная ссылка',
    },
  },
});

export default model<IUser>('User', userSchema);
