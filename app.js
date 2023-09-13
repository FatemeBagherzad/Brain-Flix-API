const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const router = require('./routers/router');
const app = express();

//MiddleWares
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}
app.use(express.json());
app.use(cors());
app.use(morgan('dev'));

app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
  next();
});
app.use('/', router);

module.exports = app;
