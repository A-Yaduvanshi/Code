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
    var data = "{'status':'Data is not inserted'}";
    res.sendStatus(400).send(data);
}
    }
);

    


router.get('/login',(req,res)=>{

 
    var email = req.query.email;
    var password= req.query.password;
 
if(email != undefined && password != undefined){
    var sql="SELECT * FROM `users` WHERE `email`=? AND `password`=?";
    con.query(sql,[email,password], function (err, result){
       res.sendStatus(200).send("User Login"); 
    });
}
else{
    var data = "{'status':'email is empty'}";
    res.sendStatus(400).send(data);
}
});


module.exports = router;