var auth = require('./auth'),
	users = require('./users'),
	posts = require('./posts');
	
module.exports = {
    // Extras
    // init: init,
    // http: http,
    // API Endpoints
    auth: auth,
    users: users,
    posts: posts
};
