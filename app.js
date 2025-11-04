var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const cors = require('cors');

require('dotenv').config();

var indexRouter = require('./routes/index');
var articlesRouter = require('./routes/articles');
var authRouter = require('./routes/auth');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// Configure CORS - Update this section
app.use(cors({
  origin:         process.env.FRONTEND_URL || 'http://localhost:3000',
  methods:        ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials:    true
}));

app.use('/', indexRouter);

app.use('/articles', articlesRouter);
app.use('/auth', authRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next){
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next){
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);

  // Send JSON error response for API routes
  if (req.path.startsWith('/auth') || req.path.startsWith('/articles')){
    res.json({
      message: err.message,
      error:   req.app.get('env') === 'development' ? err : {}
    });
  } else {
    res.render('error');
  }
});

module.exports = app;
