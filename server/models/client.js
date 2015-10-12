'use strict';

// 加载依赖
var mongoose = require('mongoose');

var ClientSchema = new mongoose.Schema({
    clientId: {
        type: String,
        unique: true,
        required: true
    },
    clientSecret: {
        type: String,
        required: true
    },
});

// 导出模块
module.exports = mongoose.model('Client', ClientSchema);
