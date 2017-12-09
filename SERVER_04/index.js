
var express= require("express");                       
var app= express();

app.use(express.static("./public"));   //nghĩa là khi có yêu cầu từ client thì  mọi yêu cầu đó vào thư mục public mà tim
//khai báo template engine
app.set("view engine","ejs");                          
app.set("views","./views");

var server=require("http").createServer(app);
server.listen(3000,console.log("ket noi thanh cong"));




app.get("/", function(req,res){
    res.render("trangchu");
});