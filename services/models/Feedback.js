import { Schema, model } from 'mongoose';

const schema = new Schema({
  name: {
    type: String,
    required: true
  },
  status: {
    type: String,
    required: true
  },
  rating: {
    type: Number,
    required: true
  },
  feedbackText: {
    type: String,
    required: true
  },
  avatarName: {
    type: String,
    required: true
  }
});

export default model('Feedback', schema);
