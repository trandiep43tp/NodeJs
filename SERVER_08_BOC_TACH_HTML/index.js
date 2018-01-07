
//https://www.youtube.com/watch?v=RyH5v7QRm7o
var express = require("express");
var app = express();
app.use(express.static("public"));
app.set("view engine", "ejs");
app.set("views", "views");

var server= require("http").createServer(app);
app.listen(3000);

//khai báo biến request
var request = require("request");
var cheerio = require("cheerio");

app.get("/", function(req,res){
    request("https://vnexpress.net", function(error, response,body){
        if(error){
            console.log(error);
            res.render("trangchu", {html: "Có lỗi xảy ra"})
        }else{
           // console.log(body);
           $=cheerio.load(body);
           var ds= $(body).find("a[title]");   //tìm tất cả các thẻ a có thuộc tính title
           //var ds= $(body).find("a.icon_commend"); //tìm thẻ a có class icon_commend. nếu tìm theo id thì viết a#icon_commend
           // không nên dung map và foreach để duyệt
           //console.log(ds);
           /*
           ds.each( function(i, e){
               console.log(i);      //i là số thứ tự
               //console.log($(this).text());
               console.log(e["attribs"]["href"]);
           })
           */
           res.render("trangchu", {html: ds});
        }
    })   
})