'use strict';

// 加载依赖
var mongoose = require('mongoose');

var AccessTokenSchema = new mongoose.Schema({
    userId: {
        type: String,
    },
    clientId: {
        type: String,
    },
    token: {
        type: String,
        unique: true,
        required: true
    },
    scope: {
        type: String,
        require: true
    },
    expirationDate: {
        type: Date,
        require: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

// 导出模块
module.exports = mongoose.model('AccessToken', AccessTokenSchema);
