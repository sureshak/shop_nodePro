var Logs = require('./model.js');
var crypt = require('../../../app/api/utils/');


exports.create = function(req,res,next) {	
	 data = {
	   userId: req.body.userid,
	   email:  req.body.email,
	   message:req.body.message,
	   
	}
	newLogs = new Logs(data);
	newLogs.save(function(err,data){
		if(err)
			res.send(500,err);
		else
			res.json({status:true,data:newLogs});
	})
};



exports.findByEmail = function(req,res) {
	Logs.find({email:req.params.email},function(err,data) {
		if(err) 
			return res.send(500,err);
		else
			return res.json(200,data);
	});
};


exports.findAll = function(req,res) {
	Logs.find({},function(err,data) {
		if(err) 
			return res.send(500,err);
		else
			return res.json(200,data);
	});
};


exports.findByDates = function(req,res) {
	var start = req.params.startDate;
	var end = req.params.endDate;
	Logs.find({date:{ $gte: new Date(start), $lt: new Date(end)}},function(err,data) {
		if(err) 
			return res.send(500,err);
		else
			return res.json(200,data);
	});
};
