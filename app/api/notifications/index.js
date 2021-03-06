var express = require('express');
var controller = require('./controller.js');
var path = '../../../config'
//var passport = require(path+'/passport.js');
var passport = require('passport');
var router = express.Router();

router.post('/',controller.create);
router.get('/:email',controller.findByEmail);
router.get('/',controller.findAll);

router.post('/:id',controller.updateByEmail);

module.exports  = router;
