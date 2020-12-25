const createError = require('http-errors'),
      express = require('express'),
      path = require('path'),
      cookieParser = require('cookie-parser'),
      logger = require('morgan'),
      sassMiddleware = require('node-sass-middleware'),
      bodyParser = require('body-parser'),
      cors = require('cors'),
      Observer = require('./services/observe');
      // sass processing stuff
      srcPath = __dirname + '/assets/',
      destPath = __dirname + '/public/';

global.appRoot = require('app-root-path');

let indexRouter = require('./routes/index');
let slateRouter = require('./routes/slate');
let filesRouter = require('./routes/files');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(logger('dev'));
// use CORS on all them routes
app.use(cors());
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))
// parse application/json
app.use(bodyParser.json())

app.use(cookieParser());
// SASS Compilation
app.use(sassMiddleware({
  src: srcPath,
  dest: destPath,
  indentedSyntax: false, // true = .sass and false = .scss
  sourceMap: true
}));
app.use(express.static(path.join(__dirname, '/public')));
app.use('/editor', express.static(__dirname + '/node_modules/codemirror/'));
app.use('/bifont', express.static(__dirname + '/node_modules/bootstrap-icons/font/'));
// map for bootstrap icons? maybe
app.use('/icons.svg', express.static(__dirname + '/node_modules/bootstrap-icons/bootstrap-icons.svg'));

app.use('/', indexRouter);
app.use('/s', slateRouter);
app.use('/f', filesRouter);

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
