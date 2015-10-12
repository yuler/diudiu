var User = require('../models/user');

var users = {
  query: function (req, res) {
      User.query(null, function (err, users) {
          res.json(users);
      });
  },
  store: function (req, res) {
      var user = new User(req.body);
      user.store(null, function (err) {
        if(err)
          res.send(err);
        res.json({'message':'创建 用户 成功'});
      });
  }
}

module.exports = users;
