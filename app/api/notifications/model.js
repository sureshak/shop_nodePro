var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var uniqueValidator = require('mongoose-unique-validator');


var notificationSchema = new Schema({
   message: String,
   doctorEmail:  String,
   flag:Boolean,
   date:{ type: Date, default: Date.now }
  
});


//export user model
module.exports = mongoose.model('Notification', notificationSchema);

