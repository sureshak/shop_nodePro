
var LocalStrategy = require('passport-local').Strategy;
var FacebookStrategy = require('passport-facebook').Strategy;

var User = require('../app/api/user/model.js')

	
module.exports = function(passport) {

	  // used to serialize the user for the session
    passport.serializeUser(function(user, done) {
        done(null, user.id);
    });

    // used to deserialize the user
    passport.deserializeUser(function(id, done) {
        User.findById(id, function(err, user) {
            done(err, user);
        });
    });

	passport.use('local-login',new LocalStrategy(function(email,password,done){

			User.findOne({email:email},function(err,data){
				if(err)
					return done(err);
				if(!data)
					return done(null,false,{message:'Incorrect Username'});
				else if(validateUser(email,password,data))
					return done(null,true,{message:true})

			});

		}));
	};


function validateUser(email,password,data) {
	if(email == data.email && password == data.password) 
		return true;
	else
		return false;	
}