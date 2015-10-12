// 加载依赖
var passport = require('passport');
var BasicStrategy = require('passport-http').BasicStrategy;
// var DigestStrategy = require('passport-http').DigestStrategy;
var ClientPasswordStrategy = require('passport-oauth2-client-password').Strategy;
var BearerStrategy = require('passport-http-bearer');

var User = require('../models/user');
var Client = require('../models/client');
var AccessToken = require('../models/accessToken');

/**
 * Authorization Basic username:password  base64 编码
 */
passport.use(new BasicStrategy(
  function(username, password, done) {
    Client.findOne({ clientId: username }, function (err, client) {
      if (err) { return done(err); }
      if (!client) {
        return done(null, false);
      }
      if(password != client.clientSecret){
        return done(null, false);
      }
      return done(null, client);
    });
  }
));

/**
 *  Body client_id client_secret
 */
passport.use(new ClientPasswordStrategy(
  function (clientId, clientSecret, done) {
    Client.findOne({ clientId: clientId }, function(err, client) {
        if (err) { return done(err); }
        if (!client) { return done(null, false); }
        if (client.clientSecret != clientSecret) { return done(null, false); }

        return done(null, client);
    });
  }
));

/**
 *  Body access_token
 */
passport.use(new BearerStrategy(
  function(accessToken, done) {
    // console.log(accessToken);
    AccessToken.findOne({ token: accessToken }, function (err, accessToken) {
      if (err) { return done(err); }
      if (!accessToken) { return done(null, false); }
      if (new Date() < accessToken.expirationDate){
          // AccessToken.delete(accessToken, function (err) {
          //   return done(err);
          // });
          return done(null, false);
      }else{
        if (accessToken.userId != null) {
            User.findOne({ id:accessToken.userId }, function (err, user) {
              console.log(user+'1');
              if (err) {
                return done(err);
              }
              if (!user) {
                return done(null, false);
              }
              // to keep this example simple, restricted scopes are not implemented,
              // and this is just for illustrative purposes
              var info = { scope: '*' };
              return done(null, user, info);
            });
          } else {
            //The request came from a client only since userID is null
            //therefore the client is passed back instead of a user
            console.log(accessToken.clientId);
            Client.findById(accessToken.clientId, function (err, client) {
              console.log(client);
              if (err) {
                return done(err);
              }
              if (!client) {
                return done(null, false);
              }
              // to keep this example simple, restricted scopes are not implemented,
              // and this is just for illustrative purposes
              var info = { scope: '*' };
              return done(null, client, info);
            });
          }
      }
    });
  }
));

exports.basic = passport.authenticate('basic', { session : false ,failureFlash: true});
exports.oauth2ClientPassword = passport.authenticate('oauth2-client-password', {session: false, failureFlash: true});
exports.bearer = function(req, res, next){
    passport.authenticate('bearer', {session: false}, function(err, user, info) {
        console.log(user,info);
        if (err) { return next(err); }

        //authentication error
        // if (!user) { return res.json({error: info.error_description || 'Invalid Token'}) }

        //success
        // req.logIn(user, function(err) {
          // if (err) { return next(err); }
          return next();
        // });

    })(req, res, next)
}
