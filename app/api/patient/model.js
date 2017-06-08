var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var uniqueValidator = require('mongoose-unique-validator');


var patientSchema = new Schema({
   name: String,
   age:  Number,
   address:String,
   mobile:String,
   nominess:String,
   date:{ type: Date, default: Date.now },
   admissionDate:String,
   admissionDetails:String,
   doctorName:String,
   hospitalName:String,
   problems:String,
   drugs:String,
   dosage:String,
   email:{ type: String, lowercase: true,required: true, unique: true },
   password:String,
   sharedDoctor:[{ type: String }]

});

patientSchema.plugin(uniqueValidator);

//export user model
module.exports = mongoose.model('Patient', patientSchema);