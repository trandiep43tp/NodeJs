
var express= require("express");                       
var app= express();

app.use(express.static("./public"));   //nghĩa là khi có yêu cầu từ client thì  mọi yêu cầu đó vào thư mục public mà tim
//khai báo template engine
app.set("view engine","ejs");                          
app.set("views","./views");

var server=require("http").createServer(app);
var io=require("socket.io")(server);          //khai báo socket.io
server.listen(3000);

//socket lắng nghe kết nối
io.on("connection",function(socket){
    console.log("co nguoi ket noi: " + socket.id);
    socket.on("disconnect",function(){
        console.log(socket.id + " ngat ket noi");
    });

    //nhận dữ liệu từ client
    socket.on("client-send-data", function(data){
        console.log(socket.id + " gui data: " + data);

        //server chỉ gửi lại cho chính client gui lên. 
        //socket.emit("server-send-data",data + "888");

        //server gửi lại tất cả các client
        //io.sockets.emit("server-send-data", data + "888");

        //server gửi lại cho các client trừ client gửi lên
        socket.broadcast.emit();
        
        //server gửi riêng cho 1 client nào đó
        //io.to(socket.id).emit("server-send-data", data + "888");
        
    });

});

app.get("/", function(req,res){
    res.render("trangchu");
});