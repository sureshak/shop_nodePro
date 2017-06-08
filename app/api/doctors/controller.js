var Doctor = require('./model.js');
var crypt = require('../../../app/api/utils/');


exports.create = function(req,res,next) {	
	 data = {
	   name: req.body.name,
	   age:  req.body.age,
	   mobile:req.body.mobile,
	   qualification:req.body.qualification,
	   special:req.body.special,
	   email:req.body.email
	}
	newDoctor = new Doctor(data);
	newDoctor.save(function(err,data){
		if(err)
			res.send(500,err);
		else
			res.json({status:true,data:newDoctor});
	})
};


exports.findByEmail = function(req,res) {
	Doctor.find({email:req.params.email},function(err,data) {
		if(err) 
			return res.send(500,err);
		else
			return res.json(200,data);
	});
};


exports.findAll = function(req,res) {
	Doctor.find({},function(err,data) {
		if(err) 
			return res.send(500,err);
		else
			return res.json(200,data);
	});
};

var defaultDoctor = new Doctor({
 	name: "doctor",
   age:  26,
   mobile:"920000000",
   qualification:"MBBS",
   special:"heart",
   email:"doctor@gmail.com"
})

Doctor.find({email:'doctor@gmail.com'},function(err,data) {
		if(err) 
			return res.send(500,err);
		else if(data.length <= 0) {
			defaultDoctor.save(function (err) {if (err) console.log ('Error on save!')});
			console.log("Default value Inserted");
		}
});
 