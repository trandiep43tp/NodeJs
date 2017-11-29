
//tất cả những dữ liệu gì cũng có thể chuyển thành buffer. khi chuyển qua buffer thì mới có thể chuyển qua máy 
// khác được hoặc luu database

//chuyển sang buffer
 buffer = new Buffer("Xin Chào Điệp","utf-8");
console.log(buffer);

//chuyển buffer --> string
	console.log(buffer.toString());
//chuyển buffer -->JSon
	console.log(buffer.toJSON());


//chuyển Json sang buffer rồi sang string

var json={ type: 'Buffer',  data: [ 88, 105, 110, 32, 67, 104, 195, 160, 111 ] };  //chuỗi json
var js = new Buffer(json);  //chuyển chuỗi Json sang buffer
console.log(js.toString()); //chuyển buffer sang chuỗi



//cách lấy dữ liệu từ file danh sách
var fs = require("fs");  //gọi module dạng file
var noidung=fs.readFileSync( __dirname + "/danhsach.txt");
console.log(noidung);
console.log(noidung.toString());