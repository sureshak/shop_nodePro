var FileUpload = require('./model.js');
var crypt = require('../../../app/api/utils/');


exports.create = function(req,res,next) {	
	 data = {
		filename : req.body.filename,
		email : req.body.email,
		original_name:req.body.original_name
	}
	newFile = new FileUpload(data);
	newFile.save(function(err,data){
		if(err)
			res.send(500,err);
		else
			res.json({status:true,data:newFile});
	})
};


exports.findByEmail = function(req,res) {
	FileUpload.find({email:req.params.email},function(err,data) {
		if(err) 
			return res.send(500,err);
		else
			return res.json(200,data);
	});
};
