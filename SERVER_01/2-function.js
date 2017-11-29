//cách 1
function tinhTong(a,b){
	return a+b;
}

x=tinhTong(3,5);
console.log(x);

//cách 2 cách gọi hàm trong hàm khác
function hello(){
	console.log("Chao mưng ban den voi khoa hoc");	
}

function goiHam(fn){
	fn();
}

goiHam(hello);

//cách 3
var tong=function(){
	console.log("Khao hoc lap trinh Node Js");
}

tong();  //goi tong nghia là goi hàm