function KhoaHoc(ten, hocphi){
	this.name=ten;
	this.price=hocphi;
}

//hành động của khóa học
KhoaHoc.prototype.mota=function(){
	console.log("Hello "+ this.name + " " + this.price);
}

var nodejs= new KhoaHoc("Khoa hoc nodejs",800000);
nodejs.mota();
