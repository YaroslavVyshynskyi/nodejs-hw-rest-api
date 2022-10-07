const express = require('express');
const logger = require('morgan');
const cors = require('cors');
const mongoose = require('mongoose');
const dotenv = require('dotenv');

const contactsRouter = require('./routes/api/contacts');
const app = express();
const formatsLogger = app.get('env') === 'development' ? 'dev' : 'short';

dotenv.config();
const { DB_HOST } = process.env;
// const { DB_HOST } = require('./config/config');

mongoose
  .connect(DB_HOST)
  .then(() => console.log('Database connection successful'))
  .catch(error => console.log(error.message));

app.use(logger(formatsLogger));
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/contacts', contactsRouter);

app.use((reg, res) => {
  res.status(404).json({ message: 'Not found' });
});

app.use((err, req, res, next) => {
  const { status = 500, message = 'Server error' } = err;
  res.status(status).json({ message });
});

module.exports = app;
