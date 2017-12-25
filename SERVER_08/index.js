var express= require("express");
var app=express();

app.use(express.static("public"));

app.set("view engine", "ejs");
app.set("views","./views");

var server= require("http").createServer(app);
var io=require("socket.io")(server);
server.listen(3000);

//cấu hình io
io.on("connect", function(socket){
    console.log("co nguoi ket noi"+ socket.id);
    socket.on("disconnect", function(){
        console.log(socket.id + " ngat ket noi");
    })
});

app.get("/", function(req,res){
    res.render("trangchu");
});