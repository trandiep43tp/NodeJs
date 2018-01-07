var express = require("express");
var app = express();

app.use(express.static("public"));
app.set("view engine", "ejs");
app.set("views", "./views");
var server= require("http").createServer(app);
var io=require("socket.io")(server);
server.listen(3000);;

//kết nối pgAdmin
var pg= require("pg");
var config={
    user: "postgres",
    password: "thucpham",
    database: "sinhviens",
    port: "5432",
    host: "localhost",
    max: "10",                       //chỉ cho 10 người kết nối vào
    idleTimeoutMilis: "3000"        //thời gian time out
}

var pool = new pg.Pool(config);
var bodyparser= require("body-parser");
var urlencodedParser = bodyparser.urlencoded({ extended: false });

app.get("/sinhvien/list", function(req,res){
    pool.connect( function(err,client,done){
        if(err){
            res.end();
            return console.error("loi ket noi",err);
        }
        client.query("SELECT * FROM sinhvien ORDER BY id ASC ", function(err,result){
            if(err){
                res.end();
                return console.error("bi loi truy van", err);
            }
            res.render("sinhvien_list",{data: result.rows});
        })
    })
    
});

app.get("/", function(req,res){
    res.render("main.ejs");
});

app.get("/sinhvien/them", function(req, res){
    res.render("sinhvien_them.ejs")
});

app.post("/sinhvien/them",urlencodedParser, function(req, res){
    //để insert database
    var hoten=req.body.txtTen;
    var email=req.body.txtEmail;
    pool.connect( function(err,client,done){
        if(err){
            res.end();
            return console.error("loi ket noi",err);
        }
        client.query("INSERT INTO sinhvien(hoten,email) VALUES('"+ hoten + "','"+ email +"')", function(err,result){
           done();  //call done to release the client back to the pool
            if(err){
                res.end();
                return console.error("bi loi truy van", err);
            }
            res.redirect("../sinhvien/list");      //chuyển về trang sinhvien_list
        })
    })
})

//sửa sinh viên
app.get("/sinhvien/sua/:x", function(req,res){
    //lấy id sinh viên cần sửa
    //lấy thông tin sinh viên thông qua id
    //hiện thông tin sinh viên
    var id=req.params.x;
    pool.connect( function(err,client,done){
        if(err){
            res.end();
            return console.error("loi ket noi",err);
        }
        client.query("SELECT * FROM sinhvien WHERE id='"+id+ "'", function(err,result){
            done();
            if(err){
                res.end();
                return console.error("bi loi truy van", err);
            }
            res.render("sinhvien_sua",{data: result.rows[0]});
        })
    })   
})

app.post("/sinhvien/sua/:x",urlencodedParser, function(req,res){
    var id=req.params.x;
    var hoten= req.body.txtTen;
    var email=req.body.txtEmail;
    pool.connect( function(err,client,done){
        if(err){
            res.end();
            return console.error("loi ket noi",err);
        }
        client.query("UPDATE sinhvien SET hoten='"+ hoten + "', email='"+ email +"' WHERE id="+id, function(err,result){
            done();
            if(err){
                res.end();
                return console.error("bi loi truy van", err);
            }
            res.redirect("/sinhvien/list");      //chuyển về trang sinhvien_list
        })
    })
})

//xóa sinh viên
app.get("/sinhvien/xoa/:x", function(req, res){
    var id=req.params.x ;
    pool.connect( function(err,client,done){
        if(err){
            res.end();
            return console.error("loi ket noi",err);
        }
        client.query("DELETE FROM sinhvien WHERE id='"+id+"'", function(err,result){
            done();
            if(err){
                res.end();
                return console.error("bi loi truy van", err);
            }
            res.redirect("/sinhvien/list");      //chuyển về trang sinhvien_list
        })
    })
})