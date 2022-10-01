const express = require('express')
const app = express()
var cors = require('cors')
// const port = 3002;
const {connect, con} = require('./mySqlConnect');


app.use(cors())
app.use('/api',require('./routes/routes'));


connect();
app.get('/', (req, res) => {
    res.send('How to work is goin on');
})


const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Example app listening on port ${PORT}`)
  })
  