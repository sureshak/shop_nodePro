var app = angular.module('app',['ngRoute','ngStorage','ngMessages','ngFileUpload','ui.bootstrap','chart.js']);
app.constant('DEV', { user: "/api/user" ,
	medical:"/api/medical",file:"api/file",doctor:'/api/doctor',patient:'/api/patient',
	logs:'/api/logs',notification:'/api/notification',heart:'/api/heart'});



app.config([ '$routeProvider', '$httpProvider',
	function($routeProvider, $httpProvider) {

	$httpProvider.interceptors.push(function ($q) {
             return {
                 'request': function (config) {
                     config.url = window.location.pathname+config.url;
                     return config || $q.when(config);

                 }

             }
         });

		$routeProvider.when('/', {
			templateUrl : 'login.html',
		}).when('/register', {
			templateUrl : 'register.html',
		}).when('/dashboard', {
			templateUrl : 'dashboard.html',
		}).when('/add_patient', {
			templateUrl : 'add_patient.html',
		})
		.when('/add_doctors', {
			templateUrl : 'add_doctors.html',
		})
		.when('/logs', {
			templateUrl : 'logs.html',
		})
		.when('/notification', {
			templateUrl : 'notifications.html',
		})
		.when('/share', {
			templateUrl : 'share.html',
		})
		.when('/graph', {
			templateUrl : 'graph.html',
		})
		.otherwise({
			redirectTo : '/'
		});
	}]);

app.controller('login_controller',function($scope,$http,DEV,$window,$localStorage,$sessionStorage) {
	$scope.logUserAction = function(data) {
		$http.post(DEV.logs,data).success(function(data){
			console.log('logs')
		}).error(function(data){	
			console.log('logs error')
		});
	}
	$scope.message='';
	$scope.login=function() {

		$http.post(DEV.user+'/login',$scope.Login).success(function(data){
			if(data.status == false) {
				$scope.message='Invalid Username / password';
			}

			else if(data.user.role == 'doctor' || data.user.role == 'admin') {
				$localStorage.USER = data.user;
				$sessionStorage.USER = data.user;
				var data = {
					   "userId": $sessionStorage.USER._id,
					   "email":  $sessionStorage.USER.email,
					   "message":"User " + data.user.name + " Logged IN system"
						}
						$scope.logUserAction(data);
				$window.location.href = '#/dashboard';
			}

			else if(data.user.role == 'user')	{
				$localStorage.USER = data.user;
				$sessionStorage.USER = data.user;
				var data = {
					   "userId": $sessionStorage.USER._id,
					   "email":  $sessionStorage.USER.email,
					   "message":"User " + data.user.name + " Logged IN system"
						}
						$scope.logUserAction(data);
				$window.location.href = '#/dashboard';
			}

		}).error(function(data){
			console.log(data);
		});

	}
});

app.controller('graph_controller',function($scope,$http,DEV,$window,$localStorage,$sessionStorage, $interval, $filter) {
	console.log('graph')

	$scope.getHeartData = function() {
		var mobile = $sessionStorage.USER.mobile
		if(mobile == undefined) {
			mobile = "9003808408"
		}
		var DATA = [];
		var url = DEV.heart+'/:'+mobile;
		console.log(url)
		$http.get(url).success(function(data){
			console.log(data);
			if(data.length<=0){
				             
			}else {
				for(i in data.length) {
					DATA.push(data.rate)
				}
			}
		});
	}

  $scope.labels = [];
  $scope.series = ['Series A', 'Series B'];
  
  $scope.data = [
    [65, 59, 80, 81, 56, 55, 40],
    [28, 48, 40, 19, 86, 27, 90]
  ];

  $scope.onClick = function (points, evt) {
    console.log(points, evt);
  };
	
	 	console.log(DEV.heart+'/'+$sessionStorage.USER.mobile)
      	$http.get(DEV.heart+'/'+$sessionStorage.USER.mobile).success(function(data){
      		 var rate= [];
      		for(i in data){
      			 $scope.data.push(data[i].rate)
      			 var date = $filter('date')(data[i].date, "yyyy/MM/dd");
      			 $scope.labels.push(date)
      		}
      	}).error(function(data){

      	});
        console.log('update with timeout fired')
   	 $scope.onClick = function (points, evt) {
    console.log(points, evt);
  };

});


app.controller('dashboard_controller',function($scope,$http,DEV,$window,$localStorage,$sessionStorage,Upload, $timeout) {
	if($sessionStorage.USER == null)
		$window.location.href = '/';

	$scope.ListOfUploadedFiles = [];
	$scope.doctor={};
	$scope.ListofDoctors=[];
	$scope.ListofPatients=[];
	$scope.showDocInfo = false;
	$scope.newpatient={};
	$scope.showAlertPatient = false;
	$scope.showPatient = false;

	var doctor_own = [{
		name:$sessionStorage.USER.name,
		email:$sessionStorage.USER.email
	}]
	
	if($sessionStorage.USER.role!='admin') {
		$scope.doctorsList = doctor_own;
	}
	else {
			$http.get(DEV.doctor).success(function(data){
				$scope.doctorsList = data;
			}).error(function(data){

			});
	}

			$http.get(DEV.doctor).success(function(data){
				$scope.doctorsListShare = data;
			}).error(function(data){

			});
	

	$scope.getUploadedFiles = function() {
		if($sessionStorage.USER.role == 'user') {
			$http.get(DEV.file+'/'+$sessionStorage.USER.email).success(function(data){
				$scope.ListOfUploadedFiles = data;
			}).error(function(data){

			});
		}
	};
	$scope.getDoctors = function() {
		if($sessionStorage.USER.role != 'user') {
			$http.get(DEV.doctor).success(function(data){
				$scope.ListofDoctors = data;
			}).error(function(data){

			});
		}
	};
	$scope.getPatients = function() {

		if($sessionStorage.USER.role == 'admin') {
			$http.get(DEV.patient).success(function(data){
				$scope.ListofPatients = data;
			}).error(function(data){

			});
		}
		if($sessionStorage.USER.role == 'doctor') {
			$http.get(DEV.patient+'/doctorEmail/'+$sessionStorage.USER.email).success(function(data){
				$scope.ListofPatients = data;
			}).error(function(data){

			});
		}
	};

	$scope.getSharedDocuments = function () {
		if($sessionStorage.USER.role == 'doctor') {
			$http.get(DEV.patient+'/share/'+$sessionStorage.USER.email).success(function(data){
				
				for(i in data) {
					data.shared = true;
					$scope.ListofPatients.push(data[i]);
				}
					
			}).error(function(data){

			});
		}
	}


	$scope.loadPatientDetails = function() {
		if($sessionStorage.USER.role == 'user') {
			$http.get(DEV.patient+'/'+$sessionStorage.USER.email).success(function(data){
				$scope.patientInfo = data[0];
			}).error(function(data){

			});
		}
	};

	$scope.logUserAction = function(data) {
		$http.post(DEV.logs,data).success(function(data){
			console.log('logs')
		}).error(function(data){	
			console.log('logs error')
		});
	}

	$scope.getUploadedFiles();
	$scope.getDoctors();
	$scope.getPatients();
	$scope.loadPatientDetails();
	$scope.getSharedDocuments(); 

	$scope.logout=function() {
	
			var data = {
			   "userId": $sessionStorage.USER._id,
			   "email":  $sessionStorage.USER.email,
			   "message":"Logout out"
		}
		$scope.logUserAction(data);
		$sessionStorage.USER = null;
		$localStorage.USER = null;
	
		$window.location.href = window.location.pathname;
	}

	$scope.currentUser = $sessionStorage.USER;
	

	$scope.uploadFiles = function(files, errFiles) {
		$scope.files = files;
		$scope.errFiles = errFiles;
		angular.forEach(files, function(file) {

			file.upload = Upload.upload({
				url: '/upload/'+$sessionStorage.USER.email,
				data: {file: file}
			});

			file.upload.then(function (response) {
				console.log(response.data.data)

				if(response.data.data.status) {
					var data = {"filename":response.data.data.filename,"email":response.data.data.email,'original_name':response.data.data.original_name}
					$scope.saveImageInDatabase(data);
						var data = {
						   "userId": $sessionStorage.USER._id,
						   "email":  $sessionStorage.USER.email,
						   "message":"Uploaded file:" + response.data.data.original_name
					}
					$scope.logUserAction(data);
				}
				$timeout(function () {
					file.result = response.data;
				});
			}, function (response) {

				if (response.status > 0)
					$scope.errorMsg = response.status + ': ' + response.data;
			}, function (evt) {
				file.progress = Math.min(100, parseInt(100.0 * evt.loaded / evt.total));
			});
		});
	}

	$scope.saveImageInDatabase = function(data) {


		$http.post(DEV.file,data).success(function(data){

			if(data.status) {
				$scope.ListOfUploadedFiles.push(data.data);
				
			}

		}).error(function(data){
			console.log(data);
		});
	}


	$scope.addDoctors = function () {	
		console.log($scope.doctor);
		var newUser = {
			name:$scope.doctor.name,
			email:$scope.doctor.email,
			role:'doctor',
			password:$scope.doctor.password
		}
		
		$http.post(DEV.doctor,$scope.doctor).success(function(dataDoctor){
			
			if(dataDoctor.status) {
					//add to user
					$http.post(DEV.user,newUser).success(function(data){
						
						if(data.status) {
							$scope.ListofDoctors.push(dataDoctor.data);
							$scope.doctor={};
							var logdata = {
						   "userId": $sessionStorage.USER._id,
						   "email":  $sessionStorage.USER.email,
						   "message":"Added new Doctor : " + dataDoctor.data.name
							}
							$scope.logUserAction(logdata);
						}

					}).error(function(data){
						alert('Problem Contact Admin')

					});

				}

			}).error(function(data){
				console.log(data)
			});


		}

		$scope.showDoctorInfo=function(data) {
			$scope.showDocInfo = true;
			$scope.docInfo = data;

		}

		$scope.showPatientInfo=function(data) {
			debugger
			$scope.showPatient = true;
			$scope.patientInfo = data;

		}

		$scope.addPatient = function() {
		debugger
			$http.post(DEV.patient,$scope.newpatient).success(function(newdata){
				debugger
				var newUser = {
					name:$scope.newpatient.name,
					email:$scope.newpatient.email,
					role:'user',
					password:$scope.newpatient.password,
					mobile:$scope.newpatient.mobile
				}
				

				if(newdata.status) {
					$http.post(DEV.user,newUser).success(function(data){
						
						if(data.status) {
							//alert('New Patient Added Successfully')
							$scope.showAlertPatient = true;
								var logdata = {
								   "userId": $sessionStorage.USER._id,
								   "email":  $sessionStorage.USER.email,
								   "message":"Added new Patient : " + data.data.name
									}
									debugger
							$scope.logUserAction(logdata);
						}

					}).error(function(data){
						alert('Problem Contact Admin')
					});
				}
			}).error(function(data){
				console.log(data)
				alert(data.message + data.errors.email.message)
			});

		}

		//date picker 

		$scope.popup2 = {
			opened: false
		};
		$scope.popup1 = {
			opened: false
		};

		$scope.open2 = function() {
			$scope.popup2.opened = true;
		};
		$scope.open1 = function() {
			$scope.popup1.opened = true;
		};

		$scope.maxDate = new Date(2020, 5, 22);
		$scope.minDate = $scope.minDate ? null : new Date();
		$scope.formats = ['dd-MMMM-yyyy', 'yyyy/MM/dd', 'dd.MM.yyyy', 'shortDate'];
		$scope.format = $scope.formats[1];
		
		$scope.altInputFormats = ['M!/d!/yyyy'];

		$scope.dateOptions = {
			formatYear: 'yy',
			startingDay: 1
		};

		$scope.dt1 =  new Date();
		$scope.dt2 =  new Date();


		$scope.disableSearchButton = true;
		$scope.errMessage = '';
		$scope.checkErr = function(startDate,endDate) {
		
			var curDate = new Date();
	        if(startDate > endDate){
	          $scope.errMessage = 'End Date should be greater than start date';
	          $scope.disableSearchButton = true;
	          return false;
	        }
	       else if(startDate < curDate){
	           $scope.errMessage = 'Start date should not be before today.';
	           $scope.disableSearchButton = true;
	           return false;
	        }else{
	        	$scope.errMessage =''	
	        	$scope.disableSearchButton = false;
	        }
	        

     };

     $scope.findLogs = function(startDate,endDate) {
     	/*console.log(startDate)
     	console.log(endDate)*/
     	$http.get(DEV.logs+'/'+startDate+'/'+endDate).success(function(data){
     		$scope.logs = data;
     	}).error(function(data){
			console.log(data)
     	});
     }


     $scope.loadLogs = function() {
     	$http.get(DEV.logs).success(function(data){
     		$scope.logs = data;
     	}).error(function(data){
			console.log(data)
     	});
     }
     $scope.doctorToBeNotified=null;
     $scope.notificationMessage=null;
     $scope.ListOfNotification = [];
     //notificaiton
     	$scope.getAllNotification = function() {
     		$http.get(DEV.notification).success(function(data){
     			$scope.ListOfNotification  = data;
     		}).error(function(data){

     		});
     	}	
     	$scope.getAllNotificationByDoctor = function() {

     		if($sessionStorage.USER.role == 'doctor') {
	     		$http.get(DEV.notification+'/'+ $sessionStorage.USER.email).success(function(data){
	     			$scope.ListOfDoctorNotification  = data;
	     			$scope.badgeSize = $scope.ListOfDoctorNotification.length;
	     		}).error(function(data){

	     		});	
     		}
     		
     	}	
     	$scope.getAllNotification();
	    $scope.getAllNotificationByDoctor();

     	$scope.markAsDone=function (item) {
     		console.log(item)
     		var id = item._id;
     		$http.post(DEV.notification+'/'+id).success(function(data){
     			debugger
     			for(i in $scope.ListOfDoctorNotification ){
     				if(id == $scope.ListOfDoctorNotification[i]._id){
     					var logdata = {
								   "userId": $sessionStorage.USER._id,
								   "email":  $sessionStorage.USER.email,
								   "message":"Notification Marked DONE by doctor : " + $sessionStorage.USER.email
									}
									
							$scope.logUserAction(logdata);
     					$scope.ListOfDoctorNotification.splice(i,1);
     				}
     			}
     			$scope.badgeSize = $scope.ListOfDoctorNotification.length;
     		}).error(function(data){

     		});

     	}

	     $scope.saveNotifications = function(notificationMessage) {
	     	console.log($scope.newpatient.doctorName)
	     	if($scope.newpatient.doctorName == undefined) {
	     		alert('Choose Doctor')
	     	}
	     	else {
	     		console.log(notificationMessage)
	     		var notify = {
	     			   message: notificationMessage,
					   email:  $scope.newpatient.doctorName,
					   flag:false,
	     		}
	     		
	     		$http.post(DEV.notification,notify).success(function(data){
	     			 $scope.ListOfNotification.push(data.data);
	     			 if(data!=null) {
	     			 		var logdata = {
								   "userId": $sessionStorage.USER._id,
								   "email":  $sessionStorage.USER.email,
								   "message":"Notification Added to doctor : " + $scope.newpatient.doctorName
									}
									
							$scope.logUserAction(logdata);
	     			 }
	     		}).error(function(data){

	     		});

	     	}
	     }

	     //share
	     
	     $scope.selected = 0;
	     $scope.showShareButton = false;
	     $scope.sharePatient=function(index) {
	     	console.log('shre' + index)
	     	 $scope.selected = index; 

	     	 if($scope.newpatient.doctorName == undefined) {
	     		alert('Choose Doctor')
	     	}else{

	     		console.log($scope.newpatient.doctorName);
	     		$scope.patient = $scope.ListofPatients[index];
	     		console.log($scope.patient);
	     		$scope.showShareButton = true;
	     	}

	     }

	     $scope.share = function () {
	     	console.log($scope.newpatient.doctorName)
	     	console.log($scope.patient);
	     	var shareData = {
	     		emailDoctor : $scope.newpatient.doctorName,
	     		userId : $scope.patient._id,
	     		userEmail:$scope.patient.email
	     	}
	     	console.log(shareData)
	     	$http.post(DEV.patient+'/share',shareData).success(function(data){
	     		
	     		if(data!=null) {
	     			var logdata = {
								   "userId": $sessionStorage.USER._id,
								   "email":  $sessionStorage.USER.email,
								   "message":$sessionStorage.USER.email +" Shared Patient : " + data.name
									}
									
							$scope.logUserAction(logdata);
	     		}

	     	}).error(function(data){

	     	});
	     }
	     


	});



app.directive('myDate',function(dateFilter,$parse){
  return{
    restrict:'EAC',
    require:'?ngModel',
    link:function(scope,element,attrs,ngModel,ctrl){
      ngModel.$parsers.push(function(viewValue){
        return dateFilter(viewValue,'yyyy-MM-dd');
      });
    }
  }
});

