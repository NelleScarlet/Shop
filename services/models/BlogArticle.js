import { Schema, model } from 'mongoose';

const schema = new Schema({
  date: {
    type: Date,
    required: true
  },
  author: {
    type: String,
    required: true
  },
  title: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  content: {
    type: String,
    required: true
  },
  promoImageNameMini: {
    type: String,
    required: true
  },
  promoImageName: {
    type: String,
    required: true
  }
});

export default model('BlogArticle', schema);
