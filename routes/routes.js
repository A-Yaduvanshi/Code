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
    var data = "{'status':'404','error':'Data is not inserted'}";
    res.send(data);
}
    }
);

    


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
                // res.send(results[0].password);
            //   const comparision =  bcrypt.compare(password, results[0].password)
              if(email==results[0].email&&password===results[0].password){
                  res.send({
                    "code":200,
                    "success":"login sucessfull"
                  })
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


module.exports = router;