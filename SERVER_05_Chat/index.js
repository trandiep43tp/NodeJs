
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

//khai báo 1 mảng chứa danh sách
var listUser=[];

//viết code lắng nghe xem có ai kết nối lên server hay không
io.on("connect", function(socket){                                   //chú ý là connection
    console.log("Co nguoi ket noi: "+ socket.id);
     
    //server lắng nghe sự kiện ngắt kết nối
    socket.on("disconnect",function(){                                      //chú ý là disconnect
        console.log( socket.id + " ngat ket noi");
    });    

    //nhận dữ liệu từ client
    socket.on("client-send-username", function(data){
        console.log(socket.id + " gui name: " + data);
        if(listUser.indexOf(data)>=0){              //ktra xem user có trong mảng không
          socket.emit("server-send-dk-thatbai");
        }
        else{
            listUser.push(data);
            socket.username=data;                               //tạo thêm một trường socket.username
            socket.emit("server-send-ok",data);                 //gửi ten dang nhap về chính client gưi lên
            io.sockets.emit("server-send-listUser",listUser);   //gui danh sách các user đang dang nhap cho tát cả client
        }                 
    });

    socket.on("client-send-logOut", function(){
        listUser.splice(listUser.indexOf(socket.username), 1);  //tìm phan tử logout trong mảng roi xóa
        socket.broadcast.emit("server-send-listUser",listUser);       //gửi lại danh sách user
    });

    socket.on("client-sent-message" , function(data){
        io.sockets.emit("server-send-message",{"name":socket.username, "nd": data});
    });

    socket.on("ai-dang-go-chu", function(){
        socket.broadcast.emit("dang-go-chu", socket.username + " dang go chu");
    });

    socket.on("ai-stop-go-chu", function(){
        socket.broadcast.emit("stop-go-chu");       
    })

});

app.get("/", function(req,res){
    res.render("trangchu");
});


 //server chỉ gửi lại cho chính client gui lên. 
        //socket.emit("server-send-data",data + "888");

        //server gửi lại tất cả các client
        //io.sockets.emit("server-send-data", data + "888");

        //server gửi lại cho các client trừ client gửi lên
        //socket.broadcast.emit("server-send-data", data + "888");
        
        //server gửi riêng cho 1 client nào đó
        //io.to(socket.id).emit("server-send-data", data + "888");






