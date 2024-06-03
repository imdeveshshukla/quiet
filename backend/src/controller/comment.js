import prisma from "../../db/db.config.js";

export const createComment =async (req,res)=>{
    const { postId, content,dp,username } = req.body;
    try {
        const comment = await prisma.comment.create({
            data: {
                body: content,
                postId: postId,
                userId: req.userId,
                dp:dp,
                username:username
            },
        });
        
        const newComment= await prisma.comment.findUnique({
            where:{
                id:comment.id,
            },
            include:{
                user:true,
                post:true,
            },
        })
        console.log(newComment);
        
        res.status(201).json({
            msg:"Successfully Created",
            newComment:newComment,
        });
    } catch (error) {
        console.log(error);
        
        res.status(500).json({ 
            msg: "Failed to create comment",
            error
     });
    }
}
export const getAllComment = async (req,res)=>{
    const { postId } = req.body;
    try{
        const comments = await prisma.comment.findMany({
            where:{
                postId:postId
            },
            include:{
                user:true,
                post:true,
            },
            orderBy:{
                id:"desc"
            }
        });
        res.status(201).json({
            comments
        })
    }catch (error) {
        res.status(500).json({ 
            msg: "Failed to fetch comments",
            error
     });
    }
}

export const getUserComment = async (req,res)=>{
    const { uId } = req.userId;
    try{
        const comments = await prisma.comment.findMany({
            where:{
                userId:uId,
            },
            include:{
                user:true,
                post:true,
            },
            orderBy:{
                id:'desc'
            }
        });
        res.status(201).json({
            comments
        })
    }catch (error) {
        res.status(500).json({ 
            
            msg: "Failed to fetch comments",
            error
     });
    }
}