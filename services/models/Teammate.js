import { Schema, model } from 'mongoose';

const schema = new Schema({
  name: {
    type: String,
    required: true
  },
  occupation: {
    type: String,
    required: true
  },
  photoName: {
    type: String,
    required: true
  },
  instagramLink: {
    type: String
  },
  facebookLink: {
    type: String
  },
  twitterLink: {
    type: String
  }
});

export default model('Teammate', schema);
