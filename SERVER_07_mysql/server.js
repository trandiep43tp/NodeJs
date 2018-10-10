var express= require("express");
var app=express();

app.use(express.static("public"));

var cors = require('cors')
app.use(cors()) // Use this after the variable declaration


app.set("view engine", "ejs");
app.set("views","./views");

var server = require("http").createServer(app);
var io=require("socket.io")(server);
server.listen(3001);


 
app.get("/loaimonan", function(req,res){
    var mysql= require("mysql");
    //cấu hình kết nối
    var conn= mysql.createConnection({
        host    : 'localhost',
        user    : 'root',
        password: '',
        database: 'ql_nha_hang'
    }); 
    //kết nối
    conn.connect( function(err){
            //nếu có lỗi thì in ra
            if(err) throw err;
            //nếu thành công
            console.log("ket noi thanh cong");
    });
    //lấy dữ liệu từ mysql
    var sql="SELECT * FROM loai_mon_an";
    conn.query(sql, function(error,result){
        if(error){
            return res.send(error)
        }else{
            return res.json(result)
        }

        //res.render("loai_mon_an",{kq: result}); 
        
               
    });  
    //ngắt kết nối
    conn.end(function(err){
        if(err) throw err;
        console.log("ngat ket noi thanh cong");
    });  
});


app.get("/", function(req,res){
    res.render("trangchu");
});