const express = require('express')
const authRouter = require('./routes/auth.js')
const cookieParser = require('cookie-parser')
const bodyParser = require('body-parser')
const cors = require('cors');



require('dotenv').config()
const app = express()
const port = 3000
app.use(cors({credentials:true, origin:"http://localhost:5173"}));
app.use(bodyParser.json())
app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use(cookieParser());

app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.use('/auth/',authRouter.router);

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)   
}) 