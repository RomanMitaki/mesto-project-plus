import {
  model, Schema, Model, Document,
} from 'mongoose';
import validator from 'validator';
import bcrypt from 'bcrypt';
import CustomErrors from '../error';

const linkRegExp = /^(http(s):\/\/.)[-a-zA-Z0-9@:%._+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_+.~#?&//=]*)$/;

export interface IUser {
  name: string;
  about: string;
  avatar: string;
  email: string;
  password: string;
}

interface IUserModel extends Model<IUser> {
  // eslint-disable-next-line max-len,no-unused-vars
  findUserByCredentials: (email: string, password: string) => Promise<Document<unknown, any, IUser>>
}

const userSchema = new Schema<IUser>({
  name: {
    type: String,
    default: 'Жак-Ив Кусто',
    minlength: 2,
    maxlength: 30,
  },
  about: {
    type: String,
    default: 'Исследователь',
    minlength: 2,
    maxlength: 200,
  },
  avatar: {
    type: String,
    default: 'https://pictures.s3.yandex.net/resources/jacques-cousteau_1604399756.png',
    validate: {
      validator: (v: string) => linkRegExp.test(v),
      message: 'Некорректная ссылка',
    },
  },
  email: {
    type: String,
    unique: true,
    required: [true, 'User email required'],
    validate: {
      validator: (v: string) => validator.isEmail(v),
      message: 'Неправильный формат почты',
    },
  },
  password: {
    type: String,
    required: [true, 'User password required'],
    select: false,
  },
});

userSchema.static('findUserByCredentials', async function findUserByCredentials(email: string, password: string) {
  const user = await this.findOne({ email }).select('+password');
  if (!user) {
    throw CustomErrors.auth('Неправильные почта или пароль');
  }
  const isMatched = await bcrypt.compare(password, user.password);

  if (!isMatched) {
    throw CustomErrors.auth('Неправильные почта или пароль');
  }
  return user;
});

export default model<IUser, IUserModel>('User', userSchema);
