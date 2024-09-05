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
import pollRoutes from "./routes/poll.js";


dotenv.config({
  path: './.env'
})
const app = express() 
const port = 3000
const allowedOrigins = [
  'https://www.bequiet.live', 
  'https://quiet-6jrn.onrender.com'
];

const corsOptions = {
  credentials: true,
  origin: (origin, callback) => {
    if (process.env.NODE_ENV === 'development') {
      if (origin === 'http://localhost:5173' || origin==='https://quiet-6jrn.onrender.com') {
        callback(null, true);
      } else {
        callback(new Error('Not allowed by CORS'));
      }
    } else {
      // Allow only specified origins in production
      if (allowedOrigins.includes(origin) || !origin) {
        callback(null, true);
      } else {
        callback(new Error('Not allowed by CORS'));
      }
    }
  },
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
app.use('/poll',pollRoutes);
app.use('/rooms',roomsRouter);
app.use('/search/', searchRouter);

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)   
}) 




