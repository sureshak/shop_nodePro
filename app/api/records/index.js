var express = require('express');
var controller = require('./controller.js');
var router = express.Router();


router.get('/',controller.read);
router.post('/email',controller.findByUser);
router.post('/date/:id',controller.findByDate);
router.post('/save',controller.create);

module.exports = router