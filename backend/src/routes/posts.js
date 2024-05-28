import { PrismaClient } from "@prisma/client"
import express  from "express"
import { verifyToken } from "../middlewares/verifytoken.js";
import { createPost, getPost } from "../controller/posts.js";
import { upload } from "../middlewares/multer.js";
import { createComment, getAllComment, getUserComment } from "../controller/comment.js";
import { getUpvote, upvote, upvoteNumber } from "../controller/upvotes.js";
const prismacl = new PrismaClient();
const postRoutes = express.Router();

postRoutes.use(verifyToken);

postRoutes.get("/",(req,res)=>{
    res.json({
        "server":"Healthy"
    })
})


//Post Routes 
postRoutes.get("/getPost",getPost);
postRoutes.post("/postWithImg",upload.single('postImg'),createPost);
postRoutes.post("/post",createPost);


//Comments Routes 
postRoutes.post('/comment',createComment);
postRoutes.post('/comment',getAllComment);
postRoutes.get('/comment',getUserComment);
//create getComment according to postID

//Upvotes Routes 
postRoutes.post('/upvote',upvote);
postRoutes.post('/upvoteNum',upvoteNumber);
postRoutes.get('/upvotewitUId',getUpvote)


export default postRoutes;

