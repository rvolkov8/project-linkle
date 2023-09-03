require('dotenv').config();
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
var cors = require('cors');
const corsOptions = {
  origin: '*',
  credentials: true, //access-control-allow-credentials:true
  optionSuccessStatus: 200,
};

// MongoDB connection
require('./configs/mongodbConfig');

const authRouter = require('./routes/auth');
const apiRouter = require('./routes/api');

const app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(cors(corsOptions));

app.use(express.static(path.join(__dirname, 'public')));

app.use('/', authRouter);
app.use('/api', apiRouter);

app.use((req, res) => {
  res.status(404).json({ msg: '404: Not found.' });
});

module.exports = app;
