//goi điên lên server
var socket =io("http://localhost:3000/");

$(document).ready(function(){
   $("#btnSend").click(function(){
       socket.emit("client-send-hv",
       {hoten:$("#txtHoten").val(),email: $("#txtEmail").val(), dt: $("#txtDienthoai").val()}
    );
   })
});