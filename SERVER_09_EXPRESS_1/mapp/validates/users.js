
const  {check} = require('express-validator/check');

const util = require('util');    //đây là thư viện của nodejs vào https://nodejs.org/dist/latest-v10.x/docs/api/util.html#util_util_format_format_args
var notify = require("../configs/notify");

const option = {	
	name    : { min: 1, max: 18 },
	ordering: {min: 1, max: 100},
	status  : ['novalue'],
	group   : ['novalue'],
	content : {min: 1, max: 100},
}
 

module.exports = {
	validator: () =>{
		return [
			 check('name',util.format(notify.ERROR_NAME, option.name.min, option.name.max)).isLength({min: option.name.min, max: option.name.max}),
			//ORDERING
			 check('ordering','Phai la so lon hon 0').isInt({gt: 0, lt: 100}),
			//NAME
			// req.checkBody('name',util.format(notify.ERROR_NAME, option.name.min, option.name.max)).isLength({min: option.name.min, max: option.name.max}),
			// //ORDERING
			// req.checkBody('ordering','Phai la so lon hon 0').isInt({gt: 0, lt: 100}),
			// //STATUS
			// req.checkBody('status', 'Chọn một trạng thái').not().isIn(option.status),
			// //GROUP
			// req.checkBody('group_id', 'Chọn một trạng thái').not().isIn(option.group),
			// //CONTENT
			// req.checkBody('content',util.format(notify.ERROR_NAME, option.content.min, option.content.max)).isLength({min: option.content.min, max: option.content.max})
			
		
		]			
	}
};
 



            
	

