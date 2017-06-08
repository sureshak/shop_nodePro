var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var MedicalSchema = new Schema({

	 userId:String,
	 date: { type: Date, default: Date.now },
	 description:String,
	 age:String,
	 doctorId:String

});


module.exports = mongoose.model('Medical', MedicalSchema);