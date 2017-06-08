var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var uniqueValidator = require('mongoose-unique-validator');


var UserSchema = new Schema({
  name: String,
  email: { type: String, lowercase: true,required: true, unique: true },
  role: {
    type: String,
    default: 'user'//doctor or admin
  },
  hashedPassword: String,
  mobile:String
});

UserSchema.methods.hashPassword = function(plainText) {
	console.log('pre');
	return plainText;
};


UserSchema.plugin(uniqueValidator);
//export user model
module.exports = mongoose.model('User', UserSchema);