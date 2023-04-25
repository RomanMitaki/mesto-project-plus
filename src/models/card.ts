import { model, Schema, Types } from 'mongoose';

export interface ICard {
  name: string;
  link: string;
  owner: Schema.Types.ObjectId;
  likes: [Types.ObjectId];
  createdAt: Date;
}

const cardSchema = new Schema<ICard>({
  name: {
    type: String,
    minlength: 2,
    maxlength: 30,
    required: true,
  },
  link: {
    type: String,
    required: true,
  },
  owner: {
    type: Schema.Types.ObjectId,
    ref: 'user',
    required: true,
  },
  likes: {
    type: [Types.ObjectId],
    default: [],
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export default model<ICard>('Card', cardSchema);
