var Post = require('../models/post');

var posts = {

    query: function(req, res) {
        Post.index(null,function (err, posts) {
          res.json(posts)
        });
    },

    store: function(req, res) {
        var post = new Post(req.body);
        post.store(null, function (err) {
          if(err)
            res.send(err);
          res.status(201).json({'message':'创建 post 成功'});
        });
    }
}


module.exports = posts;