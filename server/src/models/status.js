var mongoose = require('mongoose');

module.exports = mongoose.model('Status', { responseTime: Number, state: Number, timestamp: { type: Date, default: Date.now } });