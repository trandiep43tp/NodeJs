
const  {check} = require('express-validator/check');

const util = require('util');    //đây là thư viện của nodejs
var notify = require("../configs/notify");

const option = {
	name    : { min: 1, max: 8 },
	ordering: {min: 1, max: 100},
	status  : { value: 'novalue' },
	content : {min: 1, max: 100},
}
module.exports = {
	validator: () =>{
		return [
			//NAME
			check('name',util.format(notify.ERROR_NAME, option.name.min, option.name.max)).isLength({min: option.name.min, max: option.name.max}),
			//ORDERING
			check('ordering','Phai la so lon hon 0').isInt({gt: 0, lt: 100}),
			//STATUS
			check('status', 'Chọn một trạng thái').not().isIn(['novalue']),
			//CONTENT
			check('content',util.format(notify.ERROR_NAME, option.content.min, option.content.max)).isLength({min: option.content.min, max: option.content.max})
		]			
	}
};
 



            
	

