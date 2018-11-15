// JavaScript Document
var express= require("express");
var app=express();
app.listen(3333,console.log("Ket noi thanh cong"));

//phương thức get
app.get("/hello", function(req,res){
	res.send("Day la server");
	});
	 
//get có tham so
app.get("/hello/:x/:y", function(req,res){
	//lấy giá trị x, y
	var x=req.params.x;
	var y=req.params.y;
	res.send("Gia trị x: " + x + "; Gia tri y: " + y);	
	});
	
//phương thức post
app.post("/hello", function(req, res){
	res.send("Day la phuong thuc post");
	});
//post có tham so 
 
//cài module bodyparser
 var bodyParser = require('body-parser');
 //var bodyparser=require("body-parser").json();
 // create application/x-www-form-urlencoded parser
 var urlencodedParser = bodyParser.urlencoded({ extended: false });
 
app.post("/login",urlencodedParser, function(req,res){
		//lay username và pass
		var user = req.body.username;
		var pass = req.body.password;
		res.send("User name: "+ user + " Pass: " + pass);	
	});
/*	
app.post("/form",bodyparser,function(req,res){
	var user = req.body.username;
	var pass = req.body.password;
	res.send("User name: "+ user + " Pass: " + pass);
});
*/	
	
	//cấu hình ejs
	app.set("view engine", "ejs");  //khai báo template engine
	app.set("views", "./views");    //khai báo thư mục chứa view
	app.get("/", function(req,res){
		res.render("bai1");
		});

	app.get("/bai2", function(req,res){
		res.render("bai2",{name:"Tran Diep"});
	});

	app.get("/bai2/:x", function(req,res){
		var x=req.params.x;
		res.render("bai2",{name:"Tran Diep",x:x,namsinh:[1987,1988,1989,1990]});
	});

	//cách đẩy hình ảnh lên server
	//khai báo multer
	var multer= require("multer");
	//khai báo nơi lưu trữ file tải lên
	var storage=multer.diskStorage({
		destination:function(req,file,cb){  //biến cb là để kiểm tra xem có chấp nhận lưu trữ file hay k
			 cb(null,"./upload")
			 },
		filename: function(req, file, cb){  
			cb(null, file.originalname) 
		}
	})

	//khai báo biến upload
	var upload=multer({ storage: storage })
	//cách tai từng file
	app.post("/bai3",upload.single("file"),function(req,res){  //file là tên được khai báo trong input
		console.log(req.file);
		res.render("bai3",{info: "UPLOAD FILE THANH CONG"});
	});   


	app.get("/bai3", function(req,res){
		res.render("bai3",{info: ""});

	});