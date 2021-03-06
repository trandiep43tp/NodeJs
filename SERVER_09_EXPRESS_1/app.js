var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
 
//kéo các thứ hãng thứ 3 viêt
var expressLayouts = require('express-ejs-layouts');
 const flash        = require('express-flash-notification'); // hiện thông báo
const validator    = require('express-validator');
const session      = require('express-session');
var moment         = require('moment');

//kéo các thứ ta viết vào
var systemConfig = require("./mapp/configs/system");
 
// getting-started.js
var mongoose = require('mongoose');
mongoose.connect('mongodb://trandiep:trandiep123@ds111913.mlab.com:11913/traning_nodejs',{ useNewUrlParser: true });
var db = mongoose.connection;
db.on('error', () => console.log('connection error'));
db.once('open', ()=> {
  //console.log("connected")
});

//define path để khi trong các file khác ta không phải định lại đường dẫn nữa
//ta có thể khai báo 1 tập tin path định nghĩa các thư mục sau đó kéo vào
global.__base           = __dirname + '/';
global.__mapp           = __base + 'mapp/';
global.__path_configs   = __mapp + 'configs/';
global.__path_validates = __mapp + 'validates/';
global.__path_views     = __mapp + 'views/';
global.__path_schemas   = __mapp + 'schemas/';
global.__path_helpers   = __mapp + 'routes/helpers/';
global._path_models     = __mapp + 'models/';
global._path_public     = __base + 'public/';
global._path_uploads    = _path_public + 'uploads/';
global.use = 'diep';


var app = express();

// thiết lập để hiện thông báo
app.use(cookieParser());
app.use(session({
    secret: 'aaaaaaa',    //có thể dặt 1 giá trị ngẫu nhiên
    resave: false,
    saveUninitialized: true,   
}));
app.use(flash(app));
 //khai báo sử dụng validator
app.use(validator({     //ta có thể custom validator
    customValidators : {
        isNotEqual: (value1, value2)=>{
            return value1 != value2;
        }
    }
})); 


// view engine setup
app.set('views', path.join(__mapp, 'views'));
app.set('view engine', 'ejs');

//tạo 1 biến prefixAdmin để thi thoảng ta thay đổi đường dẫn
app.locals.systemConfig = systemConfig;
app.locals.moment = moment;   
 
//app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

//khai báo các router
//app.use(`(/${systemConfig.prefixAdmin})?`, require(__mapp +'routes/backend/home'));
 
//thiêt lập layout được cài vào
app.use(expressLayouts);     
app.set('layout', 'backend');

//khai báo các router tách thành 1 file riêng
app.use(`/${systemConfig.prefixAdmin}`, require(__mapp +'routes/backend/index'))

 
// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});
 
// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error', { title: 'Page Not Found' });
});

module.exports = app;
