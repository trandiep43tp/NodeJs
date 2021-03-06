var express = require('express');
var router = express.Router();
//var bodyParser = require('body-parser');

const { check, validationResult } = require('express-validator/check');

var UserModel    = require("../../schemas/users");
const validate   = require("../../validates/users");

var systemConfig = require(__path_configs + 'system');
const link = '/'+ systemConfig.prefixAdmin + '/items';

/* GET home page. */
router.get(`(/${systemConfig.prefixAdmin})?`,function(req, res, next) {  
	let item ={email: '', password: ''}
	//khai báo người đăng nhập
	
	res.render('index',{ errors: [], item } );
}); 

router.post('/submit', validate.validator(), function(req, res, next) {
	const errors = validationResult(req);
	const item       = Object.assign(req.body); 
	
	if (!errors.isEmpty()) { 		
		res.render('index', { errors: errors.array(), item });
		
	}else{
		UserModel.where(item).countDocuments((err, count)=>{ 
			if(count>0){
				//khai báo người đăng nhập
				global.use = item.email;				
				res.redirect(link);
			}else{
				let item ={email: '', password: ''}
				res.render('index',{ errors: [], item } );
			}
			
		});
	}
  
 
})

module.exports = router;
