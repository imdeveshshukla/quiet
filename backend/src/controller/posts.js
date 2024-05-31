import prisma from "../../db/db.config.js";
import zod from 'zod';
import uploadOnCloudinary from "../utils/cloudinary.js";
const post = zod.object({
    title:zod.string(),
    body:zod.string(),
    imgUrl:zod.string().optional(),
    username:zod.string(),
})
export const createPost = async (req,res)=>{
    const postbody = req.body;
    const userId = req.userId;
    
    let url = null;
    if(req.file){
        url =await uploadOnCloudinary(req.file.path);
        console.log("file Object = "+url);
    }
    const parsedBody = post.safeParse(postbody);
    if(parsedBody.error)res.status(405).json({
        msg:"Wrong Input"
    });
    try{
        const post = await prisma.post.create({
            data:{
                title:parsedBody.data.title,
                body: parsedBody.data.body,
                img:url,
                username:parsedBody.data.username,
                userId:userId//from middleware

            }
        })
        res.status(201).json({
            msg : "SuccessFully Created",
            post
        })
    }
    catch(error)
    {
        res.status(405).json({
            msg:"Some Error Occured",
            error
        })
    }
}
export const getPost = async(req,res)=>{
    const userId = req.userId;
 
    try{
        const posts = await prisma.post.findMany({
            include:{
                comments:true,
                upvotes:true,
            }
        });
        res.status(200).json({
            posts
        })
    }
    catch(error)
    {
        res.status(401).json({
            msg:"som"
        })
    }
}   

