//gọi điện lên server
var socket=io("http://localhost:3000/");

//lắng nghe server gửi danh sách các room
socket.on("server-send-ds-room", function(data){
  $("#listRoom").html("");
  data.map(function(i){
    $("#listRoom").append("<div>" +  i + "</div>");
  });    
});

socket.on("server-send-room-socket", function(data){
  $("#roomhientai").html("Room hiện tai: <b>" + data + "</b>");
})

socket.on("server-send-message", function(data){
  $("#message").append("<p>" + data + "</p></br>");
});



$(document).ready(function(){  
   $("#btnTaoroom").click(function(){
      socket.emit("tao-room", $("#txtRoom").val());
   });

   $("#btnGui").click(function(){
     socket.emit("client-sent-message",$("#txtMessage").val());
   })
});