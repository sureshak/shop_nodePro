var Records = require('./model.js');
var crypt = require('../../../app/api/utils/');

exports.read = function(req,res) {

	Records.find({},function(err,data) {
		if(err)
			res.send(500,err);
		else
			res.json(200,data);
	});

}

exports.create = function(req,res) {

	var medicalData = req.body.medicalData;
	medicalData.description = crypt.encrypt(req.body.medicalData.description);

	newData = new Records(medicalData);

	newData.save(function(err,data) {
		if(err)
			res.send(500,err);
		else
			res.json({status:true,data:newData});
	});

}


exports.findByUser = function(req,res) {

	Records.find({userId:req.body.email},function(err,data) {
		if(err){
			res.send(500,err);
		}
		else{

			res.json(200,decriptData(data));
		}
	});

}

exports.findByDate = function(req,res) {
	var now = new Date();
	now.setDate(now.getDate()- req.params.id);
	Records.find({date:{$lt: now}},function(err,data) {
		if(err){
			res.send(500,err);
		}
		else{
			res.json(200,decriptData(data));
		}
	});
}

function decriptData(data) {

	var tempData = [];


	for(i in data) {
		var singleRecord = {
			 'userId':data[i].userId,
			 'date': data[i].date,
			 'description':crypt.decrypt(data[i].description),
			 'age':data[i].age,
			 'doctorId':data[i].doctorId
		}
		tempData.push(singleRecord);
	}
	return tempData;

}