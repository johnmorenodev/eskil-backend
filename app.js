const express = require('express');
const app = express();
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
require('dotenv').config();

const productRoutes = require('./routes/productsRoutes');
const categoryRoutes = require('./routes/categoriesRoutes');
const userRoutes = require('./routes/userRoutes');

app.use(express.json());
// app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.urlencoded({ extended: true }));

app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'Origin, X-Requested-With, Content-Type, Accept, Authorization'
  );
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PATCH, DELETE');

  next();
});

app.use(productRoutes);
app.use(categoryRoutes);
app.use(userRoutes);

mongoose
  .connect(process.env.DB_URL)
  .then()
  .catch(err => console.log(err));

app.listen(3000, () => {
  console.log('Server is running');
});
