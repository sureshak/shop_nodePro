var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var uniqueValidator = require('mongoose-unique-validator');


var logsSchema = new Schema ({
   userId: String,
   email:  String,
   message:String,
   date:{ type: Date, default: Date.now } 
});


//export user model
module.exports = mongoose.model('Logs', logsSchema);

