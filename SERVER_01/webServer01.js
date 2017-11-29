var http =require("http"); //gọi module http

//khởi tạo một con server
http.createServer(function(req,res){   //req là yêu cầu khách gửi lên, res là dữ liệu trả về
		res.writeHead(200,{"Content-Type":"text/plain"});  //nếu truyền trang web thì plain thay bằng 
		res.end("Tran diep.vn");
}).listen(8888);


//muốn ngắt server nhấn Ctrl+C
//404 từ chối truy cập
//200 truy cập
//Content-Type: kiểu dữ liệu trả về khách hàng là gì
//text/plain trả về kiểu text   text/html trả về dạng html