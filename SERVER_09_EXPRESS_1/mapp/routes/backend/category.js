var express = require('express');
var router = express.Router();
const util = require('util');    //đây là thư viện của nodejs

const { check, validationResult } = require('express-validator/check');

const CategoryModel  = require(__path_schemas   + 'category');
const UsersModel   = require(__path_schemas   + 'users');
const UtilsHelper  = require(__path_helpers   + 'utils');
const ParamsHelper = require(__path_helpers   + 'params');
const StringHelper = require(__path_helpers   + 'string');
const systemConfig = require(__path_configs   + 'system');
const notify       = require(__path_configs   + 'notify');
const validateCategory = require(__path_validates + 'category');
const link          = '/'+ systemConfig.prefixAdmin + '/category';
const folderView    = __path_views + 'pages/category/';
  

router.get('(/:status)?', async (req, res, next)=> {     

	//tạo một đối tượng
	let objWhere ={};
	//lấy trạng thái được nhấn
	let currentStatus = ParamsHelper.getParams(req.params, 'status', 'all');
	//console.log(currentStatus)
	//lấy điều kiện lọc		
	 objWhere      = (currentStatus === "all" )? {} : {status: currentStatus};

	//lấy query khi nhấn search
	let query = ParamsHelper.getParams(req.query, 'search', '');  //search là tên được đặt trong input search	
	if(query !== ''){
		objWhere.name = new RegExp(query, 'i');   //RegExp(query, 'i') tìm kiếm không phân biệt các chữ hoa, thường
	}
	//in ra các trạng thái filter	
	let statusFilter  = await UtilsHelper.createFilterStatus(currentStatus, 'category');

	//lấy các điều kiện sort
	let sort_field = ParamsHelper.getParams(req.session, 'sort_field', 'ordering');
	let sort_type  = ParamsHelper.getParams(req.session, 'sort_type', 'asc');
	
	let sort = {};
		sort[sort_field] = sort_type;
	//phân trang
	let pagination ={
		totalItems : 0,
		totalItemsperPage: 4,
		currentPage		 : 1,
		pageRanges       : 3,    //để cấu hình khi có quá nhiều trang
	}
	
	// lấy số trang hiện tại
	pagination.currentPage =  parseInt(ParamsHelper.getParams(req.query, 'page', 1));

	//đếm tỏng số bản ghi
	await CategoryModel.countDocuments(objWhere).then((data)=>{
			pagination.totalItems = data;		  
		 })
	
	//lấy dữ liệu 	
	CategoryModel
		.find(objWhere)
		.select('name status ordering slug created modified ')
		.sort(sort)  //sắp xếp theo thứ tự
		.skip((pagination.currentPage - 1)*pagination.totalItemsperPage)   //lấy từ vị trí
		.limit(pagination.totalItemsperPage)
		.then((items)=> {
			res.render(folderView +'list', { 
				title: 'Category List page',
				items,
				statusFilter,
				currentStatus,
				query,
				pagination,
				sort_field,
				sort_type		
			});
		}); 

});

//thay đổi trạng thái status
router.get('/change-status/:id/:status', function(req, res, next) {
	
	let currentStatus = ParamsHelper.getParams(req.params, 'status', 'active');
	let id            = ParamsHelper.getParams(req.params, 'id', '');
	let status = (currentStatus === 'active')? 'inactive' : 'active';
	let data = {
		status,
		modified: {
            user_id: 0,
            user_name: 'admin',  
            time: Date.now()	
      }
	}	
	//update cách 1
	 CategoryModel.updateOne({_id: id}, data , (err, result)=>{
		 req.flash('success', notify.CHANGE_STATUS_SUSCCESS , false); //khi k cần render thì để false
		 res.redirect(link);
	 })
});


//change status muti
router.post('/change-status/:status', function(req, res, next) {
	let currentStatus = ParamsHelper.getParams(req.params, 'status', 'active');
	let ids = req.body.cid;  //cid là tên đặt ở ô input bên layout	
	let data = {
		status: currentStatus,
		modified: {
            user_id: 0,
            user_name: 'admin',  
            time: Date.now()	
      }
	}
	
	CategoryModel.updateMany({_id: {$in: ids}}, data, (err, result)=>{
		req.flash('success', util.format(notify.CHANGE_STATUS_MUTI_SUSCCESS, result.n ) , false);
		res.redirect(link);
	})
	
});

//change ordering
router.post('/change-ordering/', function(req, res, next) {
		let ids     = req.body.cid;
		let ordering = req.body.ordering;
		console.log(ids)
		if(Array.isArray(ids)){
			ids.forEach( (id, index) =>{
				let data = {
					ordering: parseInt(ordering[index]),
					modified: {
						user_id: 0,
						user_name: 'admin',  
						time: Date.now()	
				  }
				}
				CategoryModel.updateOne({_id: id}, data, (err, result)=>{
					
				});   
			})
			req.flash('success', util.format( notify.CHANGE_ORDERING_MUTI_SUSCCESS,ids.length ), false);
			res.redirect(link);
		}else{
			let data = {
				ordering: parseInt(ordering),
				modified: {
					user_id: 0,
					user_name: 'admin',  
					time: Date.now()	
			  }
			}
			CategoryModel.updateOne({_id: ids}, data, (err, result)=>{
				req.flash('success', notify.CHANGE_ORDERING_SUSCCESS, false);
				res.redirect(link);
			})
		}
	
	
});

//khi nhấn delete
router.get('/delete/:id', function(req, res, next) {	

	let id  = ParamsHelper.getParams(req.params, 'id', '');
	CategoryModel.deleteOne({_id: id},  (err)=>{
		req.flash('success', notify.DELETE_SUSCCESS, false);
		res.redirect(link);
	 })
	
});

//delete- muti
router.post('/delete', function(req, res, next) {	
	let items = req.body.cid;    //cid là tên đặt trong ô input
	
	CategoryModel.deleteMany({_id: {$in: items}}, (err, result)=>{
		req.flash('success', util.format( notify.DELETE_MUTI_SUSCCESS, result.n ), false);
		res.redirect(link);
	})
	
});
			 

//add và Edit
router.get('/form/:status/:id?', function(req, res, next) {  
	let currentStatus = ParamsHelper.getParams(req.params, 'status', 'add');
	let id 			  = ParamsHelper.getParams(req.params, 'id', '');	
	let errors        = [];
	if(currentStatus == 'add'){
		let item = {name: '', ordering: 0, status: 'novalue', content: ''}			
		res.render(folderView +'form', { title: 'Item Add page', item, errors });
	}else{
		CategoryModel.findById(id)
			.then((item)=>{
				res.render(folderView + 'form', { title: 'Item Edit page', item, errors });
			})
		
	}
  
});

//validate.validator() là modun mình tự viết
router.post('/save',validateCategory.validator(),function(req, res, next){
	const errors = validationResult(req);
	const itemEdit       = Object.assign(req.body);  //lấy lại các thứ gửi lên
	console.log(itemEdit)
	const item = {
		id: itemEdit.id,
		name: itemEdit.name, 
		ordering: parseInt(itemEdit.ordering), 
		status: itemEdit.status, 
		slug: StringHelper.createSlug(itemEdit.slug),
		content: itemEdit.content
	};	
	//console.log(errors.array())
	if(item.id !==''){  //edit
		if (!errors.isEmpty()) { 		
			res.render(folderView + 'form', { 
				title: 'Item Edit page',
				item,
				errors: errors.array()				
			});
			
		}else{
			item.modified ={
				user_id: 0,
				user_name: "admin",
				time : Date.now()
			}
			CategoryModel.updateOne({_id: item.id}, item, (err, result)=>{
				
				if(err) console.log(err);
				req.flash('success', notify.CHANGE_ITEM_SUSCCESS, false);
				res.redirect(link);
			})
		}

	}else{ //add
		if (!errors.isEmpty()) { 		
			res.render(folderView + 'form', { 
				title: 'Item Add page',
				item,
				errors: errors.array()				
			});
			
		}else{
			item.created ={
				user_id: 0,
				user_name: "admin",
				time : Date.now()
			}
			var newItem = new CategoryModel(item);
			newItem.save().then((err, result)=>{
				req.flash('success', notify.ADD_SUSCCESS , false);
				res.redirect(link);
			})
		}

	}
})

//SORT
router.get('/sort/:sort_field/:sort_type', function(req, res, next) {  

	let sort_field = ParamsHelper.getParams(req.params, 'sort_field', 'ordering');
	let sort_type = ParamsHelper.getParams(req.params, 'sort_type', 'asc');

	//lưu vào trong session
	req.session.sort_field = sort_field;
	req.session.sort_type = sort_type;
	res.redirect(link);
});

//thay đổi group
router.get('/change-group/:id/:group', function(req, res, next) {
	
	let currentgroup = ParamsHelper.getParams(req.params, 'group', 'yes');
	let id            = ParamsHelper.getParams(req.params, 'id', '');
	let group_acp = (currentgroup === 'yes')? 'no' : 'yes';
	let data = {
		group_acp,
		modified: {
            user_id: 0,
            user_name: 'admin',  
            time: Date.now()	
      }
	}	
	//update cách 1
	 CategoryModel.updateOne({_id: id}, data , (err, result)=>{
		 req.flash('success', notify.CHANGE_GROUP_SUSCCESS , false); //khi k cần render thì để false
		 res.redirect(link);
	 })
});

module.exports = router;
 