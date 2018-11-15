var express = require('express');
var router = express.Router();
const util = require('util');    //đây là thư viện của nodejs


const { check, validationResult } = require('express-validator/check');
const multer          = require("multer");
var upload = multer()

const UsersModel   = require(__path_schemas   + 'users');
const GroupsModel  = require(__path_schemas   + 'groups');
const UtilsHelper  = require(__path_helpers   + 'utils');
const ParamsHelper = require(__path_helpers   + 'params');
const UploadHelper = require(__path_helpers   + 'upload');
const systemConfig = require(__path_configs   + 'system');
const notify       = require(__path_configs   + 'notify');
const validateUsers = require(__path_validates + 'users');
const link         = '/'+ systemConfig.prefixAdmin + '/users';
const folderView   = __path_views + 'pages/users/';

const uploadAvatar = UploadHelper.upload('avatar', 'users'); //avatar là tên trong input trong form nhập file



//test upload file
router.get('/upload', function(req, res, next) {  
	let errors        = [];
	res.render(folderView +'upload', { title: 'upload file', errors});	
});  
//test upload file
router.post('/upload', (req, res, next)=>{
	let errors        = [];
	uploadAvatar(req, res, function (err) {
		if (err) {
			errors.push({param: 'Avatar', msg: err})
		  // An unknown error occurred when uploading.
		}
	 
		// Everything went fine.
		res.render(folderView +'upload', { title: 'upload file', errors });	
	})
	
})

router.get('(/:status)?',async (req, res, next)=> {     //(/:status)? đây là những ký hiệu trong regularexpression nghã là có cũng được, không có cũng đươcj
	//kiểm tra xem có người đăng nhập không, nếu không  có quay lại trang chủ
	if(use === ''){		
		res.redirect(`/${systemConfig.prefixAdmin}`)
	}
	 
	//tạo một đối tượng
	let objWhere ={};
	//lấy trạng thái được nhấn
	let currentStatus = ParamsHelper.getParams(req.params, 'status', 'all');
	
	//lấy điều kiện lọc		
	 objWhere      = (currentStatus === "all" )? {} : {status: currentStatus};

	//lấy query khi nhấn search
	let query = ParamsHelper.getParams(req.query, 'search', '');  //search là tên được đặt trong input search	
	if(query !== ''){
		objWhere.name = new RegExp(query, 'i');   //RegExp(query, 'i') tìm kiếm không phân biệt các chữ hoa, thường
	}
	//in ra các trạng thái filter	
	let statusFilter  = await UtilsHelper.createFilterStatus(currentStatus, 'users');
	
	//lấy các điều kiện sort
	let sort_field = ParamsHelper.getParams(req.session, 'sort_field', 'ordering');
	let sort_type  = ParamsHelper.getParams(req.session, 'sort_type', 'asc');
	let groupId    = ParamsHelper.getParams(req.session, 'group_id', 'novalue');
	if(groupId != 'novalue'){
		objWhere['group.id'] =  groupId;
	}
	 
	//console.log(objWhere)
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
	await UsersModel.countDocuments(objWhere).then((data)=>{
			pagination.totalItems = data;		  
		 })
	
		 //lấy danh sách group
	let groupsItems = [];
	await GroupsModel
		.find({})
		.select('id name')
		.then((items)=>{
			groupsItems = items;			
		})
	
	//lấy dữ liệu 	
	UsersModel
		.find(objWhere)
		.select('name status ordering created modified group.name')
		.sort(sort)  //sắp xếp theo thứ tự
		.skip((pagination.currentPage - 1)*pagination.totalItemsperPage)   //lấy từ vị trí
		.limit(pagination.totalItemsperPage)
		.then((items)=> {
			res.render(folderView + 'list', { 
				title: 'Item List page',
				items,
				statusFilter,
				currentStatus,
				query,
				pagination,
				sort_field,
				sort_type,
				groupsItems,
				groupId
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
	 UsersModel.updateOne({_id: id}, data , (err, result)=>{
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
	
	UsersModel.updateMany({_id: {$in: ids}}, data, (err, result)=>{
		req.flash('success', util.format(notify.CHANGE_STATUS_MUTI_SUSCCESS, result.n ) , false);
		res.redirect(link);
	})
	
});

//change ordering
router.post('/change-ordering/', function(req, res, next) {
		let ids     = req.body.cid;
		let ordering = req.body.ordering;
		//console.log(ids)
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
				UsersModel.updateOne({_id: id}, data, (err, result)=>{
					
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
			UsersModel.updateOne({_id: ids}, data, (err, result)=>{
				req.flash('success', notify.CHANGE_ORDERING_SUSCCESS, false);
				res.redirect(link);
			})
		}
	
	
});

//khi nhấn delete
router.get('/delete/:id', function(req, res, next) {	

	let id  = ParamsHelper.getParams(req.params, 'id', '');
	UsersModel.deleteOne({_id: id},  (err)=>{
		req.flash('success', notify.DELETE_SUSCCESS, false);
		res.redirect(link);
	 })
	
});

//delete- muti
router.post('/delete', function(req, res, next) {	
	let items = req.body.cid;    //cid là tên đặt trong ô input
	
	UsersModel.deleteMany({_id: {$in: items}}, (err, result)=>{
		req.flash('success', util.format( notify.DELETE_MUTI_SUSCCESS, result.n ), false);
		res.redirect(link);
	})
	
});
			  

//add và Edit
router.get('/form/:status/:id?', async function(req, res, next) {  
	let currentStatus = ParamsHelper.getParams(req.params, 'status', 'add');
	let id 			  = ParamsHelper.getParams(req.params, 'id', '');	
	let errors        = [];
	let groupsItems = [];
	await GroupsModel
		.find({})
		.select('id name')
		.then((items)=>{
			groupsItems = items;			
		})
	if(currentStatus == 'add'){
		let item = {name: '', ordering: 0, status: 'novalue', content: '', group: {id: '', name: ''}}			
		res.render(folderView +'form', { title: 'Users Add page', item, groupsItems, errors });
	}else{
		UsersModel.findById(id)
			.then((item)=>{
				res.render(folderView +'form', { title: 'Users Edit page', item, groupsItems, errors });
			})
		
	}
  
});

//validate.validator() là modun mình tự viết
router.post('/save',  (req, res, next)=>{	
	validateUsers.validator();
		const errors = validationResult(req);	
		console.log(errors.array())		 
		const itemEdit       = Object.assign(req.body);  //lấy lại các thứ gửi lên
		console.log(itemEdit)

	// uploadAvatar(req, res,next, async (err)=> {
	// 	if (err) {
	// 		console.log("LOI")
	// 		//error.push({param: 'Avatar', msg: err})		 
	// 	}
		// validateUsers.validator();
		// const errors = validationResult(req);			 
		// const itemEdit       = Object.assign(req.body);  //lấy lại các thứ gửi lên
		// console.log(itemEdit)
		// //vẫn phải lấy về để khi bị lỗi vẫn có dữ liệu truyền qua
		// let groupsItems = [];
		// await GroupsModel.find({}).select('id name').then((items)=>{
		// 		groupsItems = items;			
		// 	})
			
		// const item = {
		// 	id       : itemEdit.id,
		// 	name     : itemEdit.name, 
		// 	ordering : parseInt(itemEdit.ordering), 
		// 	status   : itemEdit.status, 
		// 	group    : {
		// 		id   : itemEdit.group_id,
		// 		name : itemEdit.group_name,
		// 	}, 
		// 	content  : itemEdit.content
		// };
		
		// //console.log(errors.array())
		// if(item.id !==''){  //edit
		// 	if (!errors.isEmpty()) { 		
		// 		res.render(folderView +'form', {title:'Users Edit page',item, groupsItems, errors: errors.array()});			
		// 	}else{
		// 		item.modified ={
		// 			user_id: 0,
		// 			user_name: "admin",
		// 			time : Date.now()
		// 		}
		// 		UsersModel.updateOne({_id: item.id}, item, (err, result)=>{
		// 			if(err) console.log(err);
		// 			req.flash('success', notify.CHANGE_ITEM_SUSCCESS, false);
		// 			res.redirect(link);
		// 		})
		// 	}

		// }else{ //add
		// 	if (!errors.isEmpty()) { 		
		// 		res.render(folderView +'form',{title:'Users Add page', item, groupsItems, errors: errors.array()});			
		// 	}else{
		// 		item.created ={
		// 			user_id: 0,
		// 			user_name: "admin",
		// 			time : Date.now()
		// 		}
		// 		var newItem = new UsersModel(item);
		// 		newItem.save().then((err, result)=>{
		// 			req.flash('success', notify.ADD_SUSCCESS , false);
		// 			res.redirect(link);
		// 		})
		// 	}
		// }
	
			
	//})
		
		
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

router.get('/filter-group/:group_id', function(req, res, next) { 

	let group_id = ParamsHelper.getParams(req.params, 'group_id', '');

	//lưu vào trong session
	req.session.group_id = group_id;
	
	res.redirect(link);
});




module.exports = router;
 