// JavaScript Document
//gọi module
var http = require("http");  //
var fs= require("fs");   //moddun dọc file tren server

//khởi tạo server
/*
http.createServer(function(req,res){
	res.writeHead(200,{"Content-Type":"text/html"});
	var data= fs.readFileSync(__dirname + "/index.html","utf-8");
	data =data.replace("{name}","Trần Văn Điệp");  //thay thế name trong data thành trần văn diep
	res.end(data);
	}).listen(9999);
	*/
	
//tạo webserver -pipe
/*
http.createServer(function(req,res){
	res.writeHead(200,{"Content-Type":"text/html"});
	fs.createReadStream(__dirname + "/index.html").pipe(res);  //thay dòng này 
	}).listen(9999);
	*/
	
//tạo webserver -trả về Json
http.createServer(function(req,res){
	res.writeHead(200,{"Content-Type":"text/html"});
	//khai báo 1 obj
	var obj={
		ten: "diep",
		ho: "tran",
		namsinh: 1983
		}
	//trả dữ liệu về dạng Json
	res.end(JSON.stringify(obj));	//chuyển obj thành chuỗi Json và đổ về cho khách hàng
	}).listen(9999);