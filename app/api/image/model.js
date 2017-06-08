var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var uniqueValidator = require('mongoose-unique-validator');


var fileSchema = new Schema({
   filename: String,
   email:  String,
   original_name:String
});


//export user model
module.exports = mongoose.model('FileUpload', fileSchema);