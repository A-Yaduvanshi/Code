const express = require('express')
const app = express()
var cors = require('cors')
// const port = 3002;
const {connect, con} = require('./mySqlConnect');

app.use(cors())
app.use('/api',require('./routes/routes'));
const sessions = require('express-session');
const cookieParser = require("cookie-parser");
//session middleware
app.use(sessions({
    secret: "thisismysecrctekeyfhrgfgrfrty84fwir767",
    saveUninitialized:true,
    cookie: { maxAge: oneDay },
    resave: false
}));
// cookie parser middleware
app.use(cookieParser());
connect();
var session;
app.get('/', (req, res) => {
    session=req.session;
    if(session.userid){
        res.send("Welcome User <a href=\'/logout'>click to logout</a>");
    }else
    res.sendFile('views/index.html',{root:__dirname})
})


const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Example app listening on port ${PORT}`)
  })
  