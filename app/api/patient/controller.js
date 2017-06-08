var Patient = require('./model.js');
var crypt = require('../../../app/api/utils/');


exports.create = function(req,res,next) {	
	 data = {
	   name: req.body.name,
	   age:  req.body.age,
	   address:req.body.address,
	   nominess:req.body.nominess,
	   date:new Date(),
	   admissionDate:req.body.admissionDate,
	   admissionDetails:req.body.admissionDetails,
	   doctorName:req.body.doctorName,
	   hospitalName:req.body.hospitalName,
	   problems:req.body.problems,
	   drugs:req.body.drugs,
	   dosage:req.body.dosage,
	   email:req.body.email,
	   password:req.body.password,
	   mobile:req.body.mobile
	}

	newPatient = new Patient(data);
	newPatient.save(function(err,data){
		if(err)
			res.send(500,err);
		else
			res.json({status:true,data:newPatient});
	})
};


exports.findByEmail = function(req,res) {
	Patient.find({email:req.params.email},function(err,data) {
		if(err) 
			return res.send(500,err);
		else
			return res.json(200,data);
	});
};


exports.findAll = function(req,res) {
	Patient.find({},'-password',function(err,data) {
		if(err) 
			return res.send(500,err);
		else
			return res.json(200,data);
	});
};

exports.findByDoctor = function(req,res) {
	Patient.find({doctorName:req.params.email},function(err,data) {
		if(err) 
			return res.send(500,err);
		else
			return res.json(200,data);
	});
};

exports.findBySharedDoctor = function(req,res) {
	Patient.find({},function(err,patients) {
		if(err) 
			return res.send(500,err);
		else{
			var patientsArary = [];
			var sharedEmail = req.params.email;
		
			for(i in patients) {
				if(patients[i].sharedDoctor.length > 0) {
					if(patients[i].sharedDoctor.indexOf(sharedEmail) > -1){
						patientsArary.push(patients[i]);
					}
				}
			}

			return res.json(200,patientsArary);
		}
			
	});
};

exports.findAndShare = function(req,res) {
	Patient.findOne({_id:req.body.userId},function(err,patient) {
		if(err) 
			return res.send(500,err);
		else {
		
			patient.sharedDoctor.push(req.body.emailDoctor)
			patient.save(function(err,data){
				if(err)
					res.send(500,err);
				else
					return res.json(200,patient);
			})
			
		}
			
	});
};


var defaultDoctor = new Patient({
 	   name: 'user',
	   age:  0,
	   address:'This is test user',
	   nominess:'This is test user',
	   date:new Date(),
	   admissionDate:'This is test user',
	   admissionDetails:'This is test user',
	   doctorName:'This is test user',
	   hospitalName:'This is test user',
	   problems:'This is test user',
	   drugs:'This is test user',
	   dosage:'This is test user',
	   email:'user@gmail.com',
	   password:'user'
})

Patient.find({email:'user@gmail.com'},function(err,data) {
		if(err) 
			return res.send(500,err);
		else if(data.length <= 0) {
			defaultDoctor.save(function (err) {if (err) console.log ('Error on save!')});
			console.log("Default value Inserted");
		}
});
 