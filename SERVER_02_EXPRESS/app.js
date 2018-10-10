// JavaScript Document
var express= require("express");
var app=express();								// gọi một biến app= modun express
var server=require("http").createServer(app);  //tạo một con server
server.listen(3000);

//trả dữ liệu cho khách hàng nếu khách hàng gọi tới cổng 3000
//giả sử kh chỉ đanh: localhosst: 3000 hay localhosst: 3000/ thì trả về
app.get("/",function(req,res){						//nếu cho dấu * sau / thì khi gọi sau cổng 3000 đánh gì cũng ra
	//res.send("<font color=red>Xin Chao</font>");  //trả vể một chuỗi
	res.sendFile(__dirname + "/index.html");      //trả về một file
});

app.get("/gioithieu.aspx",function(req,res){
	res.send("TOI LA GIOI THIEU.ASPX");  //trả vể một chuỗi
	
});

//get parameter

app.get("/tinhtong/:so1/:so2",function(req,res){	
	//lấy dư lieu ra
	var so1=req.params.so1;
	var so2=req.params.so2;		
	so1=parseInt(so1);
	so2=parseInt(so2);	
	var tong=so1+so2;	
	res.send("KET QUA:" + (so1+so2));      
});