'use strict';

// 加载依赖
var mongoose = require('mongoose');

var RefreshTokenSchema = new mongoose.Schema({
    userId: {
        type: String,
        required: true
    },
    clientId: {
        type: String,
        required: true
    },
    refreshToken: {
        type: String,
        unique: true,
        required: true
    },
    scope: {
        type: String,
        require: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

// 导出模块
module.exports = mongoose.model('RefreshToken', RefreshTokenSchema);
