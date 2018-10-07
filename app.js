var express = require('express');
var createError = require('http-errors');
var logger = require('morgan');
var cors = require('cors');
var path = require('path');

var middlewares = require('./middlewares');
var api_router = require('./api');
var serve_index = require('serve-index')

var app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cors());

const files_path = path.join(__dirname, 'webroot');

console.log(files_path)

app.use('/files',
    express.static(files_path),
    serve_index(files_path, {'icons': true})
);
app.use(middlewares);
app.use('/api', api_router);

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
    res.end(err.message);
    console.log(err);
});

module.exports = app;
