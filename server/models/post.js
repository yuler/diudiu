'use strict';

// 加载依赖
var mongoose = require('mongoose');

// 定义模型字段
var PostSchema   = new mongoose.Schema({
	title: String,
	content: String,
	picture: [String],
	status: Number,
	createdAt: { type: Date, default: Date.now },
	updatedAt: { type: Date, default: Date.now },
	deletedAt: { type: Date, default: '' },
	// publishedAt: { type: Date, default: '' }
});

/**
 * 实例化方法
 * @type {Object}
 */
PostSchema.methods = {
	store: function (options, cb) {
		this.save(cb);
	}
};

/**
 * 静态方法
 * @type {Object}
 */
PostSchema.statics = {
	index: function (options, cb) {
		this.find().exec(cb);
	}
}


// 导出模块
module.exports = mongoose.model('Post', PostSchema);