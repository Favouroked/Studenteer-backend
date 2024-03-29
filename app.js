var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var mongoose = require('mongoose');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var apiRouter = require('./routes/api');
let devEnv = require('./configs/dev.env.config');

var app = express();

let dbUrl;
if(devEnv){
    console.log('DEVELOPMENT ENVIRONMENT for app');
    dbUrl = `mongodb://localhost/JAN`;

}
else {
    console.log('PRODUCTION ENVIRONMENT for app');
    dbUrl = `mongodb://testuser66:testpass66@ds241570.mlab.com:41570/studenteer`;

}
mongoose.connect(dbUrl, (err) => {
    if (err) throw err;
    console.log('Connected to database successfully');
});

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({extended: false}));
app.use(cookieParser());

app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/api', apiRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
    next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    // render the error page
    res.status(err.status || 500);
    res.render('error');
});

app.listen(3000, (err)=> {`Now listening on port 3000`});

module.exports = app;
