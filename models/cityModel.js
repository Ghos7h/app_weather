var mongoose = require('mongoose');
var Schema   = mongoose.Schema;

var citySchema = new Schema({

module.exports = mongoose.model('city', citySchema);