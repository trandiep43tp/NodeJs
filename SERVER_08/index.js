var express= require("express");
var app=express();

app.use(express.static("public"));

app.set("view engine", "ejs");
app.set("views","./views");

var server= require("http").createServer(app);
var io=require("socket.io")(server);
server.listen(3000);

var mang=[];
 
//cấu hình io
io.on("connect", function(socket){
    console.log("co nguoi ket noi"+ socket.id);
    socket.on("disconnect", function(){
        console.log(socket.id + " ngat ket noi");
    });

    socket.on("client-send-hv", function(data){
        mang.push(
            new HocVien(data.hoten,data.email,data.dt)
        );
        console.log(mang);
        socket.emit("server-send-ds",mang);
    });
});

app.get("/", function(req,res){
    res.render("trangchu");
});


function HocVien(name,emai,telephone){
    this.NAME=name;
    this.EMAIL=emai;
    this.DT=telephone;
}

app.get("/kethua", function(req,res){
    res.render("kethua");
});