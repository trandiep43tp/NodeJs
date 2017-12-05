// JavaScript Document
var express= require("express");
var app=express();
app.listen(3000);

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
 // create application/x-www-form-urlencoded parser
 var urlencodedParser = bodyParser.urlencoded({ extended: false });
 
app.post("/login",urlencodedParser, function(req,res){
		//lay username và pass
		var user = req.body.username;
		var pass = req.body.password;
		res.send("User name: "+ user + " Pass: " + pass);	
	});
	
	
	
	//cấu hình ejs
	app.set("view engine", "ejs");  //khai báo
	app.set("views", "./views");    //khai báo thư mục chứa view
	app.get("/trangchu", function(req,res){
		res.render("bai1");
		});