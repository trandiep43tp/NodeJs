
var express= require("express");                       
var app= express();

app.use(express.static("public"));   //nghĩa là khi có yêu cầu từ client thì  mọi yêu cầu đó vào thư mục public mà tim
//khai báo template engine
app.set("view engine","ejs");                          
app.set("views","./views");

var server=require("http").createServer(app);

//khai báo socket.io
var io=require("socket.io")(server);
server.listen(3000);

//viết code lắng nghe xem có ai kết nối lên server hay không
io.on("connect", function(socket){                                   //chú ý là connection
    console.log("Co nguoi ket noi: "+ socket.id);
     
    //server lắng nghe sự kiện ngắt kết nối
    socket.on("disconnect",function(){                                      //chú ý là disconnect
        console.log( socket.id + " ngat ket noi");
    });
});


app.get("/", function(req,res){
    res.render("trangchu");
});