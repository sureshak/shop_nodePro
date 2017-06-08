var path = require('path');
var html = '/views/';
var multipart = require('connect-multiparty');
var multipartMiddleware = multipart();
var fs = require('fs-extra');
var multer = require('multer');
var fsw = require('fs');

module.exports = function(app) {


	app.use('/api/user',require('./app/api/user'));
	app.use('/api/medical',require('./app/api/records'));
	app.use('/api/file',require('./app/api/image'));
	app.use('/api/doctor',require('./app/api/doctors'));
	app.use('/api/patient',require('./app/api/patient'));
	app.use('/api/logs',require('./app/api/logs'));
	app.use('/api/notification',require('./app/api/notifications'));
	app.use('/api/heart',require('./app/api/heart'));


	app.get('/', function(req, res) {
		res.sendfile(path.join(__dirname, 'index.html'));
	});

	app.get('/download/:filename', function(req, res){
		  var file = __dirname + '/uploads/'+req.params.filename;
		  res.download(file); // Set disposition and send it.
		});

	app.post('/upload/:email', multipartMiddleware, function(req, resp) {

		var file = req.files.file;
		var filepath = req.files.file.path;
		
		var _fileName = req.params.email+'_'+file.name;  
		var uploadedData = {
			'filename':_fileName,
			'email':req.params.email,
			'status':true,
			'original_name':file.name
		};
		fsw.readFile(filepath, function (err, data) {
			if (err) {
				return console.error(err);
			}else {
				var newPath =  __dirname+"/uploads/";
				console.log(newPath);
				fsw.writeFile(newPath + _fileName, data, function (err) {
					if(err){
						console.log(err)
					}
					else{

						resp.json(200,{status:true,data:uploadedData})
					}
						
				});
			}
		});
	});
	
};