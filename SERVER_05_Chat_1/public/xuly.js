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
  data.forEach(function(hv){
    $("#boxContent").append('<div class="userOnline" socketid='+ hv.ID+ '>' + hv.NAME +'</div>');  //tạo thêm 1 trường socketid
  });

});

//láng nghe xem ai gui tin nhan
socket.on("server-send-message", function(data){
  $("#listMessage").append('<div><b>' + data.name + ": </b>"+ data.nd + '</div>');
});

//lắng nghe xem ai dang gõ chữ
socket.on("dang-go-chu", function(data){
  $("#typping").html(data);
});
socket.on("stop-go-chu", function(){
  $("#typping").html("");
});

socket.on("server-send-id-choc-ban", function(data){
  alert(data + " dang chọc kia");
})

$(document).ready(function(){  
     //khi mới khởi tạo cho hiện form login và ẩn form chat form
     $("#loginForm").show();
     $("#chatForm").hide(); 
     $("#txtMessage").focus();   
      
    
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

     $("#btnSendmessage").click(function(){
       socket.emit("client-sent-message",$("#txtMessage").val());
       $("#txtMessage").val("");
       $("#txtMessage").focus();
     });

     //làm trường hợp ai đang gõ chữ thì tông báo cho mọi người biết
     $("#txtMessage").focusin(function(){
       socket.emit("ai-dang-go-chu");
     });

     $("#txtMessage").focusout(function(){
      socket.emit("ai-stop-go-chu");
    });

    //bắt sự kiện ai click vào danh sách thì gửi câu chọc người đó
    //chú ý cách viết này
    $(document).on("click",".userOnline", function(){
      var id=$(this).attr("socketid");
      socket.emit("choc_ban",id);
    })

});