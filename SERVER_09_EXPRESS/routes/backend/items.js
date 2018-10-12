var express = require('express');
var router = express.Router();

var ItemModel = require("../../schemas/items");
var UtilsHelper = require("../helpers/utils");
var ParamsHelper = require("../helpers/params");	

var systemConfig = require("../../configs/system");
const link = '/'+ systemConfig.prefixAdmin + '/items';


/* GET home page. */
// router.get('/', function(req, res, next) {
//   res.render('index', { title: 'Item ' });
// });

router.get('(/:status)?', function(req, res, next) {     //(/:status)? đây là những ký hiệu trong regularexpression nghã là có cũng được, không có cũng đươcj
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
	let statusFilter  = UtilsHelper.createFilterStatus(currentStatus);


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
	ItemModel.count(objWhere).then((data)=>{
		pagination.totalItems = data;
		//lấy dữ liệu 	
		ItemModel
			.find(objWhere)
			.sort({ordering: 'asc'})  //sắp xếp theo thứ tự
			.skip((pagination.currentPage - 1)*pagination.totalItemsperPage)   //lấy từ vị trí
			.limit(pagination.totalItemsperPage)
			.then((items)=> {
				res.render('pages/items/list', { 
					title: 'Item List page',
					items,
					statusFilter,
					currentStatus,
					query,
					pagination		
				});
		    });   
	})
});

//thay đổi trạng thái status
router.get('/change-status/:id/:status', function(req, res, next) {
	let currentStatus = ParamsHelper.getParams(req.params, 'status', 'active');
	let id            = ParamsHelper.getParams(req.params, 'id', '');
	let status = (currentStatus === 'active')? 'inactive' : 'active';	
	//update cách 1
	 ItemModel.updateOne({_id: id}, {status: status}, (err, result)=>{
		 req.flash('success', 'Cập nhật Status thành công!', false); //khi k cần render thì để false
		 res.redirect(link);
	 })

	
	//update cách 2
	// ItemModel.findById(id)
	// 	.then((itemResult)=>{
	// 		itemResult.status = status;
	// 		itemResult.save().then((result)=>{
	// 			res.redirect( `/${link}/items`)
	// 		})
	// 	})	
});


//change status muti
router.post('/change-status/:status', function(req, res, next) {
	let currentStatus = ParamsHelper.getParams(req.params, 'status', 'active');
	let items = req.body.cid;  //cid là tên đặt ở ô input bên layout
	
	ItemModel.updateMany({_id: {$in: items}}, {status: currentStatus}, (err, result)=>{
		req.flash('success', `Có ${result.n } phần tử cập nhật Status thành công!`, false);
		res.redirect(link);
	})
	
});

//change ordering
router.post('/change-ordering/', function(req, res, next) {
		let ids     = req.body.cid;
		let ordering = req.body.ordering;
		
		if(Array.isArray(ids)){
			ids.forEach( (id, index) =>{
				ItemModel.updateOne({_id: id}, {ordering: parseInt(ordering[index])}, (err, result)=>{
					
				});   
			})
			req.flash('success', `Có ${ids.length} phần tử cập nhật ordering thành công!`, false);
			res.redirect(link);
		}else{
			ItemModel.updateOne({_id: ids}, {ordering: parseInt(ordering)}, (err, result)=>{
				req.flash('success', 'Cập nhật ordering thành công!', false);
				res.redirect(link);
			})
		}
	
	
});

//khi nhấn delete
router.get('/delete/:id', function(req, res, next) {	

	let id  = ParamsHelper.getParams(req.params, 'id', '');
	ItemModel.deleteOne({_id: id},  (err)=>{
		req.flash('success', 'Xóa thành công!', false);
		res.redirect(link);
	 })
	
});

//delete- muti
router.post('/delete', function(req, res, next) {	
	let items = req.body.cid;    //cid là tên đặt trong ô input
	
	ItemModel.deleteMany({_id: {$in: items}}, (err, result)=>{
		req.flash('success', `Có ${result.n } phần tử xóa thành công!`, false);
		res.redirect(link);
	})
	
});
			 

//add và Edit
router.get('/form/:status/:id?', function(req, res, next) {  
	let currentStatus = ParamsHelper.getParams(req.params, 'status', 'add');
	let id 			  = ParamsHelper.getParams(req.params, 'id', '');	

	if(currentStatus == 'add'){
		let item = {name: '', ordering: 0, status: 'novalue'}
		res.render('pages/items/form', { title: 'Item Add page', item });
	}else{
		ItemModel.findById(id)
			.then((item)=>{
				res.render('pages/items/form', { title: 'Item Edit page', item });
			})
		
	}
  
});

router.post('/save', function(req, res, next){
	let id = req.body.id;
	let item = {
		name   : req.body.name,
		status : req.body.status,
		ordering: parseInt(req.body.ordering) 
	}
	if(id !==''){
		ItemModel.updateOne({_id: id}, item, (err, result)=>{
			req.flash('success', 'Cập nhật item thành công!', false);
			res.redirect(link);
		})
	}else{
		var newItem = new ItemModel( item);
		newItem.save().then((err, result)=>{
			req.flash('success', 'Thêm item thành công!', false);
			res.redirect(link);
		})		
	}
})

module.exports = router;
 