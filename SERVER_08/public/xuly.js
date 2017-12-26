//goi điên lên server
var socket =io("http://localhost:3000/");
socket.on("server-send-ds", function(data){
    $("#ds").html("");
    data.map(function(hv, index){       
        $("#ds").append(`
             <div class="hocvien">
                <div class="hang1">id:`+(index+1) +` ||<span>`+ hv.NAME + `</span></div>
                <div class="hang2">` + hv.EMAIL + ` - `+ hv.DT +`</div>
            </div>
        `);
    });
});

$(document).ready(function(){
   $("#btnSend").click(function(){
       socket.emit("client-send-hv",
       {hoten:$("#txtHoten").val(),email: $("#txtEmail").val(), dt: $("#txtDienthoai").val()}
    );
   })
});