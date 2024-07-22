import { PrismaClient } from "@prisma/client"
import express  from "express"
import { verifyToken } from "../middlewares/verifytoken.js";
import { createPost, getPost,getAPost,getHotPost } from "../controller/posts.js";
import { upload } from "../middlewares/multer.js";
import { createComment, getAllComment, getUserComment } from "../controller/comment.js";
import {  upvoteNumber, vote } from "../controller/upvotes.js";
const prismacl = new PrismaClient();
const postRoutes = express.Router();

// postRoutes.use(verifyToken);

postRoutes.get("/",(req,res)=>{
    res.json({
        "server":"Healthy"
    })
})


//Post Routes 
postRoutes.get("/getPost",getPost);
postRoutes.get("/getaPost",getAPost);
postRoutes.post("/postWithImg",verifyToken,upload.single('postImg'),createPost);
postRoutes.post("/post",verifyToken,createPost);

//hotTopicsPost
postRoutes.get("/q/hottopic", getHotPost);


//Comments Routes 
postRoutes.post('/createcomment',verifyToken,createComment);
postRoutes.post('/getallcomment',getAllComment);
postRoutes.get('/comment',getUserComment);
//create getComment according to postID

//Upvotes Routes 
postRoutes.post('/vote',verifyToken,vote);
postRoutes.post('/upvoteNum',upvoteNumber);


export default postRoutes;

