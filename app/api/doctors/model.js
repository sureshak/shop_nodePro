var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var uniqueValidator = require('mongoose-unique-validator');


var doctorSchema = new Schema({
   name: String,
   age:  Number,
   mobile:String,
   qualification:String,
   special:String,
   email:{ type: String, lowercase: true,required: true, unique: true }
});

doctorSchema.plugin(uniqueValidator);

//export user model
module.exports = mongoose.model('Doctor', doctorSchema);

