import express  from "express"
import { verifyToken } from "../middlewares/verifytoken.js";
import { createPost, getPost,getAPost,getHotPost, getPopularPosts, deletePost } from "../controller/posts.js";
import { upload } from "../middlewares/multer.js";
import { createComment, deleteComment, getAllComment, getUserComment } from "../controller/comment.js";
import {  upvoteNumber, vote } from "../controller/upvotes.js";

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
postRoutes.post("/postWithImg",verifyToken,upload.array('postImg'),createPost);
postRoutes.post("/post",verifyToken,createPost);
postRoutes.delete("/delete",verifyToken,deletePost);

//hotTopicsPost
postRoutes.get("/q/hottopic", getHotPost);
postRoutes.get('/popular',getPopularPosts);


//Comments Routes 
postRoutes.post('/createcomment',verifyToken,createComment);
postRoutes.post('/getallcomment',getAllComment);
postRoutes.get('/comment',getUserComment);
postRoutes.delete('/deleteComment',verifyToken,deleteComment);

//create getComment according to postID

//Upvotes Routes 
postRoutes.post('/vote',verifyToken,vote);
postRoutes.post('/upvoteNum',upvoteNumber);


export default postRoutes;

