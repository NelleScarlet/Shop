import { Schema, model } from 'mongoose';

const schema = new Schema({
  email: {
    type: String,
    required: true
  }
});

export default model('Subscriber', schema);
