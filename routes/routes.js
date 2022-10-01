const express = require('express')
const app = express()
const router = express.Router()
var mysql = require('mysql');
const {connect, con} = require('../mySqlConnect');
// var uuid = require("uuid");
var axios = require('axios');
const multer= require('multer');
const path = require('path');
// const { con } = require('../mySqlConnect');

// creating 24 hours from milliseconds




router.get('/register',(req,res)=>{

    var name = req.query.name;
    var email = req.query.email;
    var password = req.query.password;
   var mobile =req.query.mobile;

if(name != undefined && email != undefined && password != undefined && mobile != undefined){
con.query("SELECT * FROM `users` WHERE `email`='"+email+"'",function (error, results, fields) {
    if (error) {
      res.send({
        "code":400,
        "failed":"error ocurred"
      });
    } else{
        if(results.length>0){
            res.send({"status":"200",
        "Error":"Email Already exits"});
        }else{
        con.query("INSERT INTO `users`(`id`, `name`, `email`, `mobile`, `password`) VALUES (NULL,'"+name+"','"+email+"','"+mobile+"','"+password+"')", function (err, result){
            // var data = "{'status':Registration Complete'}";
            
            res.send({"status":"200",
                "name":name,"email":email,"mobile":mobile}); 
        });
    }
}

});} else{
    var data = "{'status':'404','error':'Data is not inserted'}";
    res.send(data);
}
    }
);

router.get('/logout',(req,res) => {
    req.session.destroy();
    res.redirect('/login');
}); 

var session;
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
              if(email===results[0].email&&password===results[0].password){
                // session=req.session;
                session.userid=email;
               
                  res.send({
                    "code":200,
                    // "success":"login sucessfull",
                    "name":results[0].name,
                    "email":results[0].email,
                    "mobile":results[0].mobile,
                                  });
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
        callBack(null, './uploads')     // './public/images/' directory name where save the file
    },
    filename: (req, file, callBack) => {
        callBack(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname))
    }
})
 
var upload = multer({
    storage: storage
});

   
 // handle single file upload
 router.get('upload', upload.single('image'), (req, res) => {
    if (!req.file) {
        res.send("No file upload");
    } else {
        res.send(req.file.filename)
        var title=req.body.title;
        var description=req.body.description;
        var imgsrc = 'https://womensafety.cleverapps.io/api/uploads' + req.file.filename
        var insertData = "INSERT INTO `Blogs`(`id`, `title`, `description`, `image`) VALUES (NULL,?)"
        con.query(insertData, [title,description,imgsrc], (err, result) => {
            if (err) throw err
            res.send("data uploade")
        })
    }
});


module.exports = router;