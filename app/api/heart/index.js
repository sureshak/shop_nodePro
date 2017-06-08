var express = require('express');
var controller = require('./controller.js');
var path = '../../../config'
//var passport = require(path+'/passport.js');
var passport = require('passport');
var router = express.Router();

router.get('/last',controller.findLast);
router.get('/:mobile/:email/:rate',controller.create);
router.get('/:mobile',controller.findByMobile);
router.get('/',controller.findAll);
router.get('/:startDate/:endDate',controller.findByDates);




module.exports  = router;
