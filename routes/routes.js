const express = require('express')
const router = express.Router()
var mysql = require('mysql');
const {connect, con} = require('../mySqlConnect');
// var uuid = require("uuid");
var axios = require('axios');
// const { con } = require('../mySqlConnect');


router.get('/register',(req,res)=>{

    var name = req.query.name;
    var email = req.query.email;
    var password = req.query.password;
   var mobile =req.query.mobile;

if(name != undefined && email != undefined && password != undefined && mobile != undefined){
    con.query("INSERT INTO `users`(`id`, `name`, `email`, `mobile`, `password`) VALUES (NULL,'"+name+"','"+email+"','"+mobile+"','"+password+"')", function (err, result){
       res.send("Registration Complete"); 
    });
}
else{
    var data = "{'status':'Data is not inserted'}";
    res.send(data);
}
});


router.get('/show_email',(req,res)=>{

 
    var email = req.query.email;
 
if(email != undefined){
    con.query("SELECT * FROM `registration` WHERE `email` = '"+email+"'", function (err, result){
       res.send(result); 
    });
}
else{
    var data = "{'status':'email is empty'}";
    res.send(data);
}
});


module.exports = router;