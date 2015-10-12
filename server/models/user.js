'use strict';
// 加载依赖
var mongoose = require('mongoose');
var bcrypt = require('bcryptjs');

// 加密
var salt = bcrypt.genSaltSync(10);
function generatePasswordHash (password) {
	return bcrypt.hashSync(password, salt);
}

// 定义模型字段
var UserSchema   = new mongoose.Schema({
	username: String,
	password: String,
	avatar: String,
	createdAt: { type: Date, default: Date.now },
	updatedAt: { type: Date, default: Date.now },
	deletedAt: { type: Date, default: '' }
});

// 实例化方法
UserSchema.methods = {
	store: function (options, cb) {
		// 加密
		this.password = generatePasswordHash(this.password);
		this.save(cb);
	},
	validPassword: function(password, cb) {
	  bcrypt.compare(password, this.password, function(err, isMatch) {
	    if (err) return cb(err);
	    cb(null, isMatch);
	  });
	}
	// check: function (options, cb) {
		
	// }
}

// 静态方法
UserSchema.statics = {
	query: function (options, cb) {
		this.find().exec(cb);
	}

}

// 导出模块
module.exports = mongoose.model('User', UserSchema);
