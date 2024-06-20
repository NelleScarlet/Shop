import { Schema, model } from 'mongoose';

const schema = new Schema({
  name: {
    type: String,
    required: true
  },
  type: {
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
  },
  description: {
    type: String,
    required: true
  },
  date: {
    type: Date,
    required: true
  },
  clientName: {
    type: String,
    required: true
  },
  category: {
    type: String,
    required: true
  },
  service: {
    type: String,
    required: true
  },
  content: {
    type: String,
    required: true
  }
});

export default model('Farm', schema);
