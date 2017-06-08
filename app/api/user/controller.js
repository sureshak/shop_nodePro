var User = require('./model.js');
var crypt = require('../../../app/api/utils/');

exports.read = function(req,res) {

	User.find({},'-hashedPassword',function(err,data) {
		if(err) 
			return res.send(500,err);
		else
			return res.json(200,data);
	});
};

exports.create = function(req,res,next) {	
	 data = {
		name : req.body.name,
		email : req.body.email,
		mobile:req.body.mobile,
		hashedPassword:crypt.encrypt(req.body.password)
		
	}
	
	if(req.body.role.length > 1){
		data.role = req.body.role;
	}
	newUser = new User(data);
	newUser.save(function(err,data){
		if(err){
			console.log(err)
			res.send(500,err);
		}
			
		else
			res.json({status:true,data:newUser});
	})
};

exports.findByEmail = function(req,res) {
	User.find({email:req.params.email},'-hashedPassword',function(err,data) {
		if(err) 
			return res.send(500,err);
		else
			return res.json(200,data);
	});
};


exports.remove = function(req,res) {
	
	User.findOneAndRemove({email:req.params.email},function(err,data) {
		if(err) 
			return res.send(500,err);
		else
			return res.json(200,{status:true,message:"User Deleted"});
	});
};


exports.login = function(req,res) {

	User.findOne({email:req.body.email},function(err,data){
		
		if(err) {
			return res.send(500,err);
		}
		if(data==null){
			return res.json(200,{status:false,user:{message:"Invalid credentials"}});
		}	
		else {
			if(req.body.email == data.email && req.body.password == crypt.decrypt(data.hashedPassword)) {
				data.hashedPassword='';
				return res.json(200,{status:true,user:data});
			}
				
			else{
				return res.json(200,{status:false,user:{message:"Invalid credentials"}});
			}
				
		}
			
	});

}

exports.add_users = function(req,res) {
	
	var defaultusers = [{"name":"admin","email":"admin@gmail.com","password":"admin","role":"admin"},
						{"name":"doctor","email":"doctor@gmail.com","password":"doctor","role":"doctor"},
						{"name":"user","email":"user@gmail.com","password":"user","role":"user"}];
	for(i in defaultusers) {
		var data =  {
			name : defaultusers[i].name,
			email : defaultusers[i].email,
			hashedPassword:crypt.encrypt(defaultusers[i].password),
			role:defaultusers[i].role

		}
		newUser = new User(data);
		newUser.save(function(err,data){
			if(err)
				res.send(500,err);
			else
				res.send(200,{status:true,user:{message:"users added"}});
			})
	    }
   };


/*var defaultusers = [{"name":"admin","email":"admin@gmail.com","password":"admin","role":"admin"},
						{"name":"doctor","email":"doctor@gmail.com","password":"doctor","role":"doctor"},
						{"name":"user","email":"user@gmail.com","password":"user","role":"user"}];


for( i  in defaultusers) {
	
	User.find({email:defaultusers[i].email},'-hashedPassword',function(err,data) {
		if(err) 
			return res.send(500,err);
		else if(data.length <= 0) {
			console.log(defaultusers[i].email)
			newUser = new User(defaultusers[i]);
			newUser.save(function (err) {if (err) console.log (err)});
			console.log("user value Inserted");
		}
	});	
}
*/