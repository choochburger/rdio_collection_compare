
/**
 * Module dependencies.
 */

var express = require('express'),
    routes = require('./routes'),
    compare = require('./routes/compare'),
    http = require('http'),
    path = require('path'),
    config = require('./config');

var app = express();

// all environments
app.set('port', process.env.PORT || 3000);
app.set('views', __dirname + '/views');
app.set('view engine', 'jade');
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.bodyParser());
app.use(express.methodOverride());
app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));

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
app.get('/', routes.index);
app.get('/compare', compare.fetch);

http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});
