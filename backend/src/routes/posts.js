import { PrismaClient } from "@prisma/client"
import express  from "express"
import zod from 'zod'
const prismacl = new PrismaClient();
const routes = express.Router();
routes.get("/",(req,res)=>{
    res.json({
        "server":"Healthy"
    })
})

const post = zod.object({
    title:zod.string,
    body:zod.string,

})
routes.get("/posts");

routes.post("/post",(req,res)=>{
    const postbody = req.body;

    prismacl.post.create({
        data:{
            title:postbody.title,
            body: postbody.body,
            userId:postbody.usr//from middleware
        }
    })
})