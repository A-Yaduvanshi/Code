var mysql = require('mysql');

var con = mysql.createConnection({
host: 'blvfalkq32ox7e9ivlxb-mysql.services.clever-cloud.com',
port: 3306,
database: 'blvfalkq32ox7e9ivlxb',
user: 'u1hjztgmfr52fobc',
password: 'GFoAXcn6BX4BmyfRbgDz'
});
// local api

const connect = () =>{
con.connect(function(err) {

        console.log(err);

});
}
module.exports =  {
  connect,
  con,
};
