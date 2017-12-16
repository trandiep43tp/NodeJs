//gọi điện lên server
var socket=io("http://localhost:3000/");

//client nhận dữ liệu từ server


socket.on("server-send-dk-thatbai", function(){
     alert("Ten Bi Trung");
});

socket.on("server-send-ok", function(data){
  // alert(data);
  $("#curentUser").html(data);
  $("#loginForm").hide(2000);    //cho ẩn sau khoảng 2000miligiay
  $("#chatForm").show(1000);
  
});

socket.on("server-send-listUser", function(data){
  $("#boxContent").html("");    //cho nội dung của boxcontent rỗng. phòng trường hợp có nội dung nào khác
  data.forEach(function(i){
    $("#boxContent").append('<div class="userOnline">' + i +'</div>');
  });

})


$(document).ready(function(){
     //khi mới khởi tạo cho hiện form login và ẩn form chat form
     $("#loginForm").show();
     $("#chatForm").hide();     
    
     //click nút login
     $("#btnLogin").click(function(){
       var name=$("#txtUsername").val();
       socket.emit("client-send-username",name);
     })

     //click nút logout
     $("#btnLogout").click(function(){
       socket.emit("client-send-logOut");
      $("#chatForm").hide(1000); 
      $("#loginForm").show(2000);
      $("#txtUsername").val("");
      $("#txtUsername").focus();
      
     })
  });