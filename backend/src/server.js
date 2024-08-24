import express from "express";
import dotenv from "dotenv"
import authRouter from './routes/auth.js'
import userRouter from "./routes/user.js";
import cookieParser from 'cookie-parser'
import bodyParser from'body-parser'
import cors from'cors';
import postRoutes from "./routes/posts.js";
import roomsRouter from "./routes/roomsRouter.js";
import searchRouter from "./routes/search.js";


dotenv.config({
  path: './.env'
})
const app = express() 
const port = 3000
const dep = (origin, callback) => {
  const allowedOrigins = [
    'https://www.bequiet.live', 
    'https://www.bequiet.vercel.app'
  ];

  if (allowedOrigins.includes(origin) || !origin) {
    callback(null, true);
  } else {
    callback(new Error('Not allowed by CORS'));
  }
};
const corsOptions = {
  credentials: true,
  origin: (process.env.NODE_ENV === 'development')?'http://localhost:5173':dep,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: [
    "Origin",
    "Content-Type",
    "Accept",
    "Authorization",
    "X-Requested-With",
  ],
};
app.use('*',cors(corsOptions));
app.use(bodyParser.json())
app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use(cookieParser());  

app.get('/', (req, res) => { 
  res.send('Hello From Quiet Backend!')
})




app.use('/auth/',authRouter);
app.use('/u/',userRouter);
app.use('/posts',postRoutes);
app.use('/rooms',roomsRouter);
app.use('/search/', searchRouter);

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)   
}) 




