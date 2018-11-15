var express = require('express');
var router = express.Router();

router.use('/dashboard', require('./dashboard'));
router.use('/category', require('./category')); 
router.use('/items', require('./items')); 
router.use('/groups', require('./groups')); 
router.use('/users', require('./users')); 
module.exports = router;

   