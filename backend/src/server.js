import express from "express";
import dotenv from "dotenv"
import router from './routes/auth.js'
import cookieParser from 'cookie-parser'
import bodyParser from'body-parser'
import cors from'cors';
import postRoutes from "./routes/posts.js";



dotenv.config({
  path: './.env'
})
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

app.use('/auth',router);

app.use('/posts',postRoutes);
app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)   
}) 