var mongoose = require('mongoose');
var Schema = mongoose.Schema();
var gaData = new Schema({
    date: {type: Date},
    period: {type: String},
    queries:{type: String}
})

module.exports = mongoose.model('gaData', gaData);