const express = require('express')
// const app = express()
const router = express.Router()
var mysql = require('mysql');
const {connect, con} = require('../mySqlConnect');
var uuid = require("uuid");
var axios = require('axios');
const multer= require('multer');
const path = require('path');
const sessions = require('express-session');
const cookieParser = require("cookie-parser");
var genuuid=require('uuid');
router.use(cookieParser());
//session middleware
router.use(sessions({
    secret: "thisismysecrctekeyfhrgfgrfrty84fwir767",
    // saveUninitialized:true,
    // cookie: { maxAge: oneDay },
    // resave: false
}));
router.get('/register',(req,res)=>{
    var name = req.query.name;
    var email = req.query.email;
    var password = req.query.password;
   var mobile =req.query.mobile;
if(name != undefined && email != undefined && password != undefined && mobile != undefined){
con.query("INSERT INTO `users`(`id`, `name`, `email`, `mobile`, `password`) VALUES (NULL,'"+name+"','"+email+"','"+mobile+"','"+password+"')", function (err, result){
            // var data = "{'status':Registration Complete'}";
            res.json({result:"200","name":name,"email":email,"mobile":mobile
        }); 
        });}
 else{
    var data = "{'status':'404','error':'Data is not inserted'}";
    res.send(data);
}
    }
);
router.get('/logout',(req,res) => {
    req.session.destroy();
    res.redirect('/api/login');
}); 
// const oneDay = 1000 * 60 * 60 * 24;
// cookie parser middleware
var session;
// router.get('/admin', (req, res) => {
//     console.log(req)
//     // res.send("hello")
//         // res.sendFile("");
// });
router.get('/', (req, res) => {
    console.log(req)
    // res.send("hello")
    session=req.session;
    if(session.userid){
        res.send("Welcome User <a href=\'/api/logout'>click to logout</a>");
    }else
    res.send('session not define')
});
router.get('/login',(req,res)=>{
    var email = req.query.email;
    var password= req.query.password;
if(email != undefined && password != undefined){
    var sql="SELECT * FROM `users` WHERE `email`=? AND `password`=?";
    con.query(sql,[email,password], function (err, results,fields){
        if (err) {
            res.send({
              "code":400,
              "failed":"error ocurred"
            })
          }else{
            if(results.length >0){
                // res.send(results[0].email);
            //   const comparision =  bcrypt.compare(password, results[0].password)
              if(email==results[0].email&&password==results[0].password){
    req.session.userid=results[0].id;
                res.json({results});
                }
            else{
                res.send({
                     "code":204,
                     "success":"Email and password does not match"
                })
              }
            }
            else{
              res.send({
                "code":206,
                "success":"Email does not exits"
                  });
            }
          }
    });
}
});
//! Use of Multer

router.get('/jobs',(req,res)=>{
    var title=req.query.title;
    var desc=req.query.desc;
    var price=req.query.price;
    var hour=req.query.hour;
    var userid= req.query.userid;
    var ngo_name=req.query.ngo_name;
    if(title != undefined && desc != undefined && price != undefined && hour != undefined&& ngo_name!=undefined){
        con.query("INSERT INTO `price`(`id`, `title`, `description`, `price`, `hour`,`userid`,`ngo_name`) VALUES (NULL,'"+title+"','"+desc+"','"+price+"','"+hour+"','"+userid+"','"+ngo_name+"')", function (err, result){
            // var data = "{'status':Registration Complete'}";
            res.send({"status":"200",
                "title":title,"desc":desc,"price":price,"hour":hour,"ngo_name":ngo_name}); 
        });
}else{
    res.send({"status":'404'});
}});
// SELECT * FROM `price`
router.get('/jobs_fetch',(req,res)=>{
    var ngo_name=req.query.ngo_name;
        con.query("SELECT * FROM `price` WHERE `ngo_name`!='"+ngo_name+"'", function (err, data){
            // var data = "{'status':Registration Complete'}";
            res.json({data});
                // "title":result.title,"desc":result.desc,"price":result.price,"hour":result.hour}); 
        });
});

var storage = multer.diskStorage({
    destination: (req, file, callBack) => {
        callBack(null, path.join(__dirname, '../uploads'))     // './public/images/' directory name where save the file
    },
    filename: (req, file, callBack) => {
        callBack(null, uuid.v1()+"."+file.originalname.split(".").pop())
    }
})
var upload = multer({
    storage:storage
});
 // handle single file upload
 router.post('/upload', upload.single('image'), (req, res) => {
    if (!req.file) {
        console.log(req.file);
        res.send("No file upload");
    } else {
        // res.send(req.file.filename)
        console.log(req.file)
        var title=req.body.title;
        var description=req.body.description;
        var imgsrc = 'https://womensafety.cleverapps.io/uploads/' + req.file.filename
        // var insertData = ""
        con.query("INSERT INTO `Blogs`(`id`, `title`, `description`, `image`) VALUES (NULL,'"+title+"','"+description+"','"+imgsrc+"')", (err, result) => {
            if (err) throw err
            res.send(req.file)
        })
    }
});
router.post('/ngoupload', upload.single('image'), (req, res) => {
    if (!req.file) {
        console.log(req.file);
        res.send("No file upload");
    } else {
        // res.send(req.file.filename)
        console.log(req.file)
        var name=req.body.name;
        var description=req.body.description;
        var ratting=req.body.ratting;
        var imgsrc = 'https://womensafety.cleverapps.io/uploads/' + req.file.filename
        // var insertData = ""
        con.query("INSERT INTO `ngo`(`id`, `name`, `description`, `ratting`, `image`) VALUES (NULL,'"+name+"','"+description+"','"+ratting+"','"+imgsrc+"')", (err, result) => {
            if (err) throw err
            res.send(req.file)
        })
    }
});
/// SoS data upload api 
router.post('/sos',(req,res)=>{
var name=req.query.name;
var mobile=req.query.mobile;
var userid=req.query.userid;
if (name!=undefined&&mobile!=undefined&&userid!=undefined) {
    con.query("INSERT INTO `SOS` (`id`, `name`, `mobile`, `userid`) VALUES (NULL, '"+name+"', '"+mobile+"', '"+userid+"');",function(err,result){
        res.json({"status":"200"});
        })  ;
} else {
    res.json({result:"Data is not inserted"});
}
});
// SELECT * FROM `SOS` WHERE `userid`='43'
router.get('/sos_fetch',(req,res)=>{
    var userid=req.query.userid;
    con.query(" SELECT * FROM `SOS` WHERE `userid`='"+userid+"'",function(err,result){
        res.json({result});
    })  ;
}
);
/// SoS data upload api 
router.get('/ngo',(req,res)=>{
        con.query("SELECT * FROM `ngo`",function(err,result){
            res.json({result});
        })  ;
    }
);
router.get('/blogs',(req,res)=>{
    con.query("SELECT * FROM `Blogs`",function(err,result){
        res.json({result});
    })  ;
}
);
// SELECT * FROM `Blogs` 
module.exports = router;
// "INSERT INTO `price`(`id`, `title`, `description`, `price`, `hour`) VALUES (NULL,'"+title+"','"+desc+"','"+price+"','"+hour+"')"
// INSERT INTO `SOS` (`id`, `name`, `mobile`, `userid`) VALUES (NULL, 'Deepak', '8588980323', '31');