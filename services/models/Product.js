import { Schema, model } from 'mongoose';

const schema = new Schema({
  title: {
    type: String,
    required: true
  },
  category: {
    type: String,
    required: true
  },
  oldPrice: {
    type: Number,
    required: true
  },
  price: {
    type: Number,
    required: true
  },
  rating: {
    type: Number,
    required: true
  },
  imgName: {
    type: String,
    required: true
  },
  promoInfo: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  additionalInfo: {
    type: String,
    required: true
  }
});

export default model('Product', schema);
