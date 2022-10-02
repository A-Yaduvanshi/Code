const express = require('express')
const app = express();
const path = require("path")
var cors = require('cors')
const sessions = require('express-session');
const cookieParser = require("cookie-parser");
// const port = 3002;
const {connect, con} = require('./mySqlConnect');

app.use("/uploads", express.static(
  // path.join(__dirname, "uploads")
  "uploads"
))

app.use(cors());
app.use('/api',require('./routes/routes'));

connect();

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Example app listening on port ${PORT}`)
  })
  