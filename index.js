import express from 'express';
import mongoose from 'mongoose';
import session from 'express-session';

import { create as exphbs } from 'express-handlebars';
import router from './routes/router.js';

import path from 'path';
import { fileURLToPath } from 'url';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PORT = process.env.PORT || 3000;

const app = express();
const hbs = exphbs({
  defaultLayout: 'main',
  extname: 'hbs'
});

hbs.handlebars.registerHelper('times', function (n, block) {
  let accum = '';
  for (let i = 0; i < n; ++i) {
    accum += block.fn(i);
  }
  return accum;
});

app.engine('hbs', hbs.engine);
app.set('view engine', 'hbs');
app.set('views', 'views');

app.use(
  session({
    secret: 'amar',
    saveUninitialized: true,
    resave: true
  })
);

app.use(express.urlencoded({ extended: true }));

app.use(express.static(path.join(__dirname, 'public')));

app.use(router);

async function start() {
  try {
    await mongoose.connect(
      // eslint-disable-next-line max-len
      'mongodb+srv://OlenaTrofymenko:sZHzh9r2W9Vg7xV@cluster0.r28zfpj.mongodb.net/products',
      {
        useNewUrlParser: true
      }
    );
    app.listen(PORT, () => {
      console.log('Server has been started...');
    });
  } catch (e) {
    console.log(e);
  }
}

start();
