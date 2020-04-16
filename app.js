var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var bodyParser = require('body-parser');
var indexRouter = require('./routes/index');
// var mangaRouter = require('./routes/mangas');
// var chaptersRouter = require('./routes/chapters');
// var picturesRouter = require('./routes/pictures');
var usersRouter = require('./routes/users');
var adminRouter = require('./routes/admin');
var campaignsRouter = require('./routes/campaigns');
var donationsRouter = require('./routes/donations');
// var creditRouter = require('./routes/credit');
var cors = require('cors');
var app = express();
// var io = require('socket.io').listen(server);
var config = require('./config/index');


// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.json());
app.use(cors());
app.use('/', indexRouter);
app.use('/campaigns', campaignsRouter);
app.use('/donations', donationsRouter);
// app.use('/pictures', picturesRouter);
app.use('/users', usersRouter);
app.use('/admin', adminRouter);
// app.use('/genre', genreRouter);
// app.use('/document', documentRouter);
// app.use('/credit', creditRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
