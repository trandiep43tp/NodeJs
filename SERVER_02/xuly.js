// JavaScript Document
//gọi module
var http = require("http");
var fs= require("fs");

//khởi tạo server
http.createServer(function(req,res){
	res.writeHead(200,{"Content-Type":"text/html"});
	var data= fs.readFileSync(__dirname + "/index.html");
	res.end(data);
	}).listen(9999);