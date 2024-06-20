import { Schema, model } from 'mongoose';

const schema = new Schema({
  userId: {
    type: String,
    required: true
  },
  filling: {
    type: Object,
    required: true
  }
});

export default model('Cart', schema);
