const express = require('express')
const app = express()
const router = express.Router()
var mysql = require('mysql');
const {connect, con} = require('../mySqlConnect');
// var uuid = require("uuid");
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
            res.json({"status":"200"}); 
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
const oneDay = 1000 * 60 * 60 * 24;
// cookie parser middleware
var session;
router.get('/admin', (req, res) => {
    console.log(req)
    // res.send("hello")
    session=req.session;
    if(session.userid){
        res.send("Welcome User <a href=\'/api/logout'>click to logout</a>");
    }else
    res.send('session not define')
})
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
            //    res.redirect('/api/');
                //   res.send({
                //     "code":200,
                //     // "success":"login sucessfull",
                //     "name":results[0].name,
                //     "email":results[0].email,
                //     "mobile":results[0].mobile,
                //                   });
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
var storage = multer.diskStorage({
    destination: (req, file, callBack) => {
        callBack(null, 'uploads')     // './public/images/' directory name where save the file
    },
    filename: (req, file, callBack) => {
        callBack(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname))
    }
})
var upload = multer({
    storage: storage
});
router.get('/jobs',(req,res)=>{
    var title=req.query.title;
    var desc=req.query.desc;
    var price=req.query.price;
    var hour=req.query.hour;
    // var userid=session.userid;
    session=req.session;
    if(session.userid){
    if(title != undefined && desc != undefined && price != undefined && hour != undefined){
        con.query("INSERT INTO `price`(`id`, `title`, `description`, `price`, `hour`,`userid`) VALUES (NULL,'"+title+"','"+desc+"','"+price+"','"+hour+"','"+session.userid+"')", function (err, result){
            // var data = "{'status':Registration Complete'}";
            res.send({"status":"200",
                "title":title,"desc":desc,"price":price,"hour":hour}); 
        });
}else{
    res.send({"status":'404'});
}}});
// SELECT * FROM `price`
router.get('/jobs_fetch',(req,res)=>{
        con.query("SELECT * FROM `price`", function (err, data){
            // var data = "{'status':Registration Complete'}";
            res.json({data});
                // "title":result.title,"desc":result.desc,"price":result.price,"hour":result.hour}); 
        });
});
 // handle single file upload
 router.post('/upload', upload.single('upload'), (req, res) => {
    if (!req.file) {
        res.send("No file upload");
    } else {
        // res.send(req.file.filename)
        var title=req.body.title;
        var description=req.body.description;
        var imgsrc = 'https://womensafety.cleverapps.io/api/upload' + req.file.filename
        // var insertData = ""
        con.query("INSERT INTO `Blogs`(`id`, `title`, `description`, `image`) VALUES (NULL,'"+title+"','"+description+"','"+imgsrc+"')", (err, result) => {
            if (err) throw err
            res.send("data uploade")
        })
    }
});
router.get
module.exports = router;
// "INSERT INTO `price`(`id`, `title`, `description`, `price`, `hour`) VALUES (NULL,'"+title+"','"+desc+"','"+price+"','"+hour+"')"