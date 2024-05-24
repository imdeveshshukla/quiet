import { PrismaClient } from "@prisma/client"
import express  from "express"
import { verifyToken } from "../middlewares/verifytoken.js";
import { createPost, getPost } from "../controller/posts.js";
import { upload } from "../middlewares/multer.js";
const prismacl = new PrismaClient();
const postRoutes = express.Router();
postRoutes.get("/",(req,res)=>{
    res.json({
        "server":"Healthy"
    })
})


postRoutes.get("/getPost",verifyToken,getPost);

postRoutes.post("/postWithImg",verifyToken,upload.single('postImg'),createPost);

postRoutes.post("/post",verifyToken,createPost);

export default postRoutes;

