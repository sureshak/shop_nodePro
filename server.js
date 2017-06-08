var express = require('express');
var app = express();
var port     = process.env.PORT || 8000;
var mongoose = require('mongoose');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser')
var session      = require('express-session');
var cors = require('cors')
var passport = require("passport");
var LocalStrategy = require('passport-local').Strategy;
var FacebookStrategy = require('passport-facebook').Strategy;


require('./config/passport.js')(passport);

	// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))

// parse application/json
app.use(bodyParser.json())
app.use(cookieParser());

app.use(session({ secret: 'SECRET' }));
app.use(passport.initialize());
app.use(passport.session());
app.use(express.static(__dirname + '/public'));

// app.use(function(req, res, next) {
//   res.header("Access-Control-Allow-Origin", "*");
//   res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
//   next();
// });

app.use(cors())

// get show routes
require('./routes.js')(app);

var db = require('./config/database.js');
mongoose.connect(db.url); // connect to our database


//run the server

//app.listen(port);
//console.log('The magic happens on port ' + port);

module.exports = {
    app: app
}


