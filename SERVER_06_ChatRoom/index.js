
var express= require("express");                       
var app= express();

app.use(express.static("public"));   
//khai báo template engine
app.set("view engine","ejs");                          
app.set("views","./views");

var server=require("http").createServer(app);
//khai báo socket.io
var io=require("socket.io")(server);
server.listen(3000);


//viết code lắng nghe xem có ai kết nối lên server hay không
io.on("connect", function(socket){                                   
    console.log("Co nguoi ket noi: "+ socket.id);
    //console.log(socket.adapter.rooms);              //show danh sách room đang có

    //server lắng nghe sự kiện ngắt kết nối
    socket.on("disconnect",function(){                                     
       // console.log( socket.id + " ngat ket noi");
    });   

    //lắng nghe sự kiện tạo room
    //ghi chú: không có hàm tạo room mà chỉ có hàm join socket.id vào room đó thôi. mình chỉ đưa tên rồi server tự tạo room cho
    socket.on("tao-room", function(data){
        socket.join(data);
        socket.phong=data;    //tạo phòng cho socket
              
        //lấy mảng các room
        var mangRoom=[];
        for( var i in socket.adapter.rooms){   
            if(i.length<8){
                mangRoom.push(i); 
            }                                   
           
        }
       io.sockets.emit("server-send-ds-room", mangRoom);
       socket.emit("server-send-room-socket", data);
    });

    //lắng nghe sự kiện gửi massege cho nhóm
    socket.on("client-sent-message", function(data){
        io.sockets.in(socket.phong).emit("server-send-message",data);
    })

});

app.get("/", function(req,res){
    res.render("trangchu");
});


 






