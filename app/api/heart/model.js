var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var uniqueValidator = require('mongoose-unique-validator');


var heartBeatSchema = new Schema ({
   mobile: String,
   email:  String,
   rate:String,
   date:{ type: Date, default: Date.now } 
});


//export user model
module.exports = mongoose.model('HeartBeat', heartBeatSchema);

