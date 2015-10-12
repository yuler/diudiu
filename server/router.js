var express = require('express');
var api = require('./api');
var oauth2 = require('./oauth2');

var apiRoutes = function () {

	var router = express.Router();

	router.get('/users', api.auth.bearer, api.users.query);
	router.post('/users', api.auth.bearer, api.users.store);

	router.get('/posts', api.auth.bearer, api.posts.query);
	router.post('/posts', api.auth.bearer, api.posts.store);

	router.post('/oauth2/token',oauth2.token);

	return router;
}

module.exports = apiRoutes;
