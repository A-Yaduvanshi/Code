const express = require('express')
const app = express()
var cors = require('cors')
// const port = 3002;
const {connect, con} = require('./mySqlConnect');

app.use(cors())
app.use('/api',require('./routes/routes'));


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
  