var express = require('express');
var controller = require('./controller.js');
var path = '../../../config'
//var passport = require(path+'/passport.js');
var passport = require('passport');
var router = express.Router();

router.get('/',controller.read);
router.get('/read',controller.add_users);
router.get('/:email',controller.findByEmail);
router.post('/',controller.create);
router.delete('/:email',controller.remove)
router.post('/login',controller.login);


module.exports  = router;
