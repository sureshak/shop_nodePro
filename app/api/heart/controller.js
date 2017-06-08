var HeartBeat = require('./model.js');
var crypt = require('../../../app/api/utils/');


exports.create = function(req,res,next) {	
	 data = {
	   mobile: req.params.mobile,
   	   email:  req.params.email,
       rate:req.params.rate
	   
	}
	if(data.rate >= 60 && data.rate <= 120) {
		newBeat = new HeartBeat(data);
	    newBeat.save(function(err,data){
		if(err)
			res.send(500,err);
		else
			res.json({status:true,data:newBeat});
		})
	}
	
};


exports.findByMobile = function(req,res) {
	HeartBeat.find({mobile:req.params.mobile},function(err,data) {
		if(err) 
			return res.send(500,err);
		else
			return res.json(200,data);
	});
};


exports.findAll = function(req,res) {
	HeartBeat.find({},function(err,data) {
		if(err) 
			return res.send(500,err);
		else
			return res.json(200,data);
	});
};


exports.findLast = function(req,res) {
	HeartBeat.find({},function(err,data) {
		var l = data.length -1;
		
		var _data = data[l];
		if(err) 
			return res.send(500,err);
		else
			return res.json(200,_data);
	});
};

exports.findByDates = function(req,res) {
	var start = req.params.startDate;
	var end = req.params.endDate;
	HeartBeat.find({date:{ $gte: new Date(start), $lt: new Date(end)}},function(err,data) {
		if(err) 
			return res.send(500,err);
		else
			return res.json(200,data);
	});
};


exports.last = function(req,res) {
	HeartBeat.find({},function(err,data) {
		if(err) 
			return res.send(500,err);
		else
			return res.json(200,data);
	});
};
