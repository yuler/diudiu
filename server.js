var express = require('express');
var bodyParser = require('body-parser');
var oauth2orize = require('oauth2orize');
var mongoose = require('mongoose');
var flash = require('connect-flash');
var session = require('express-session');
var cookieParser = require('cookie-parser');
var passport = require('passport');

// // create OAuth 2.0 server
// var server = oauth2orize.createServer();

mongoose.connect('mongodb://localhost/diudiu');

var api = require('./server/router');

var app = express();
app.use(cookieParser());
app.use(bodyParser.urlencoded({
  extended: true
}));

app.use(session({ secret: 'diudiu',resave: false, saveUninitialized: false }));
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());

app.use('/api', api());

var server = app.listen(3000, function () {
  var host = server.address().address;
  var port = server.address().port;

  console.log('Example app listening at http://%s:%s', host, port);
});
