var Notification = require('./model.js');
var crypt = require('../../../app/api/utils/');


exports.create = function(req,res,next) {	
	 data = {
	    message: req.body.message,
  	 	doctorEmail:  req.body.email,
  	    flag:false,
	}
	newNotification = new Notification(data);
	newNotification.save(function(err,data){
		if(err)
			res.send(500,err);
		else
			res.json({status:true,data:newNotification});
	})
};


exports.findByEmail = function(req,res) {
	Notification.find({doctorEmail:req.params.email,flag:false},function(err,data) {
		if(err) 
			return res.send(500,err);
		else
			return res.json(200,data);
	});
};


exports.findAll = function(req,res) {
	Notification.find({},function(err,data) {
		if(err) 
			return res.send(500,err);
		else
			return res.json(200,data);
	});
};

exports.updateByEmail = function(req,res) {
	Notification.findOne({_id:req.params.id},function(err,notification) {
		if(err) 
			return res.send(500,err);
		else {
			notification.flag = true;
			notification.save(function(err,data) {
				if(err)
					res.send(500,err);
				else
					return res.json(200,data);
			})

			
		}
			
	});
};

