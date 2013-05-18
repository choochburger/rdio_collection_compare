
/**
 * Module dependencies.
 */

var express = require('express'),
    routes = require('./routes'),
    compare = require('./routes/compare'),
    http = require('http'),
    path = require('path'),
    config = require('./config'),
    OAuth = require('oauth').OAuth,
    querystring = require('querystring');

var app = express();

//oauth setup
app.use(express.logger());
app.use(express.bodyParser());
app.use(express.cookieParser());
app.use(express.session({
  secret: '13jFEKabrjw32rjsnzs'
}));

// all environments
app.configure(function() {
  app.set('port', process.env.PORT || 3000);
  app.set('views', __dirname + '/views');
  app.set('view engine', 'jade');
  app.use(express.favicon());
  app.use(express.logger('dev'));
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(function(req, res, next) {
    res.locals.base = function(req, res){
      return '/' == app.route ? '' : app.route;
    };
    res.locals.session = function(req, res){
      return req.session;
    };
    next();
  });
  app.use(app.router);
  app.use(express.static(path.join(__dirname, 'public')));
});

// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}

// init rdio
var rdio = require('./lib/rdio')({
  rdio_api_key: config.rdio_api_key,
  rdio_api_shared: config.rdio_api_shared,
  callback_url: config.host+":"+config.port+"/oauth/callback"
});


// Routes
require('./routes/index')(app, rdio);
require('./routes/compare')(app, rdio);

http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});
