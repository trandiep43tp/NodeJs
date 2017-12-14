//gọi điện lên server
var socket=io("http://localhost:3000/");

//client nhận dữ liệu từ server
socket.on("server-send-user", function(data){
     alert(data);
});

socket.on("server-send-ok", function(data){
   alert(data);
  //$("#loginForm").hide();
 // $("#chatForm").show();
  
});


$(document).ready(function(){
     //khi mới khởi tạo cho hiện form login và ẩn form chat form
     $("#loginform").show();
     $("#chatForm").hide();     
    
     //click nút login
     $("#btnLogin").click(function(){
       var name=$("#txtUsername").val();
       socket.emit("client-send-username",name);
     })
  });