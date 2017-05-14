var mongoose = require('mongoose');
var Schema   = mongoose.Schema;

var citySchema = new Schema({
	'name' : String,
	'searchedName': {type: String, default: ""}
});

module.exports = mongoose.model('city', citySchema);
