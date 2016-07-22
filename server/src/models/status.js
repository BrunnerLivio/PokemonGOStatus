var mongoose = require('mongoose');

module.exports = mongoose.model('Status', { state: Number, timestamp: { type: Date, default: Date.now } });