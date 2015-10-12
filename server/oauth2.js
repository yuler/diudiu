/*jslint node: true */
'use strict';

/**
 * Module dependencies.
 */
var oauth2orize = require('oauth2orize');
var passport = require('passport');
var server = oauth2orize.createServer();
var utils = require('./utils');
var AuthorizationCode = require('./models/authorizationCode');
var User = require('./models/user');
var RefreshToken = require('./models/refreshToken');
var AccessToken = require('./models/accessToken');



// Register supported grant types.
//
// OAuth 2.0 specifies a framework that allows users to grant client
// applications limited access to their protected resources.  It does this
// through a process of the user granting access, and the client exchanging
// the grant for an access token.

/**
 * Grant authorization codes
 *
 * The callback takes the `client` requesting authorization, the `redirectURI`
 * (which is used as a verifier in the subsequent exchange), the authenticated
 * `user` granting access, and their response, which contains approved scope,
 * duration, etc. as parsed by the application.  The application issues a code,
 * which is bound to these values, and will be exchanged for an access token.
 */
// server.grant(oauth2orize.grant.code(function(client, redirectURI, user, ares, done) {
//   var code = utils.uid(16);
//
//   var ac = new AuthorizationCode(code, client.id, redirectURI, user.id, ares.scope);
//   ac.save(function(err) {
//     if (err) { return done(err); }
//     return done(null, code);
//   });
// }));

/**
 * Grant implicit authorization.
 *
 * The callback takes the `client` requesting authorization, the authenticated
 * `user` granting access, and their response, which contains approved scope,
 * duration, etc. as parsed by the application.  The application issues a token,
 * which is bound to these values.
 */
// server.grant(oauth2orize.grant.token(function (client, user, ares, done) {
//   var token = utils.uid(config.token.accessTokenLength);
//   db.accessTokens.save(token, config.token.calculateExpirationDate(), user.id, client.id, client.scope, function (err) {
//     if (err) {
//       return done(err);
//     }
//     return done(null, token, {expires_in: config.token.expiresIn});
//   });
// }));


/**
 * Exchange user id and password for access tokens.
 *
 * The callback accepts the `client`, which is exchanging the user's name and password
 * from the token request for verification. If these values are validated, the
 * application issues an access token on behalf of the user who authorized the code.
 */
server.exchange(oauth2orize.exchange.password(function (client, username, password, scope, done) {
  //Validate the user
  User.findOne({username:username}, function (err, user) {
    if (err) {
      return done(err);
    }
    if (!user) {
      return done(null, false);
    }
    user.validPassword(password, function (err, isMatch) {
      if (err) {
        return done(err);
      }
      if (!isMatch){
        return done(null, false);
      }
      var token = utils.uid(16);
      var accessToken = new AccessToken({
        token: token,
        expirationDate: new Date(new Date().getTime() + (7200 * 1000)),
        userId: user.id,
        clientId: client.id,
        scope: '*'
      });
      accessToken.save(function (err) {
        if (err) {
          return done(err);
        }
        var refreshToken = new RefreshToken({
            refreshToken: utils.uid(16),
            userId: user.id,
            clientId: client.id,
            scope:'*'
        });
        refreshToken.save(function (err) {
          if (err) {
            return done(err);
          }
          return done(null, accessToken.token, refreshToken.refreshToken, {expires_in: 7200});
        });
      });
    });

  });
}));


/**
 *  Body grant_type client_credentials
 */
server.exchange(oauth2orize.exchange.clientCredentials(function (client, scope, done) {
  var accessToken = new AccessToken({
    token: utils.uid(16),
    expirationDate: new Date(new Date().getTime() + (7200 * 1000)),
    clientId: client.id,
    scope: '*'
  });
  accessToken.save(function (err) {
    if (err) {
      return done(err);
    }
    return done(null, accessToken.token, null, {expires_in: 7200});
  });
}));


/**
 *  Body grant_type refresh_token
 */
server.exchange(oauth2orize.exchange.refreshToken(function (client, refreshToken, scope, done) {
  RefreshToken.findOne({refreshToken: refreshToken}, function (err, refreshToken) {
    if (err) {
      return done(err);
    }
    if (!refreshToken) {
      return done(null, false);
    }
    if (client.id !== refreshToken.clientId) {
      return done(null, false);
    }
    refreshToken.remove(function (err) {
      if (err) {
        return done(null, false);
      }
      var token = utils.uid(16);
      var accessToken = new AccessToken({
        token: token,
        expirationDate: new Date(new Date().getTime() + (7200 * 1000)),
        userId: refreshToken.userId,
        clientId: refreshToken.clientId,
        scope: '*'
      });
      accessToken.save(function (err) {
        if (err) {
          return done(err);
        }
        var refreshToken = new RefreshToken({
            refreshToken: utils.uid(16),
            userId: accessToken.userId,
            clientId: accessToken.clientId,
            scope:'*'
        });
        refreshToken.save(function (err) {
          if (err) {
            return done(err);
          }
          return done(null, accessToken.token, refreshToken.refreshToken, {expires_in: 7200});
        });
      });
    })
  });
}));


// server.serializeClient(function (client, done) {
//   return done(null, client.id);
// });
//
// server.deserializeClient(function (id, done) {
//   db.clients.find(id, function (err, client) {
//     if (err) {
//       return done(err);
//     }
//     return done(null, client);
//   });
// });

// app.get('/dialog/authorize',
//   login.ensureLoggedIn(),
//   server.authorize(function(clientID, redirectURI, done) {
//     Clients.findOne(clientID, function(err, client) {
//       if (err) { return done(err); }
//       if (!client) { return done(null, false); }
//       if (!client.redirectUri != redirectURI) { return done(null, false); }
//       return done(null, client, client.redirectURI);
//     });
//   }),
//   function(req, res) {
//     res.render('dialog', { transactionID: req.oauth2.transactionID,
//                            user: req.user, client: req.oauth2.client });
//   });
//
//
// app.post('/dialog/authorize/decision',
//     login.ensureLoggedIn(),
//     server.decision());


// server.serializeClient(function(client, done) {
//       return done(null, client.id);
//     });
//
//     server.deserializeClient(function(id, done) {
//       Clients.findOne(id, function(err, client) {
//         if (err) { return done(err); }
//         return done(null, client);
//       });
//     });

/**
 * Token endpoint
 *
 * `token` middleware handles client requests to exchange authorization grants
 * for access tokens.  Based on the grant type being exchanged, the above
 * exchange middleware will be invoked to handle the request.  Clients must
 * authenticate when making requests to this endpoint.
 */
exports.token = [
  passport.authenticate(['basic', 'oauth2-client-password'], {session: false, failureFlash: true }),
  server.token(),
  server.errorHandler()
];
