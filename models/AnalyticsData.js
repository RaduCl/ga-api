var mongoose = require('mongoose');
var Schema = mongoose.Schema;
module.exports = mongoose.model('GAdata',{
    id: String,
    date: String,
    da: String,
});