import prisma from "../../db/db.config";

export const createComment =async (req,res)=>{
    const { postId, content } = req.body;
    try {
        const newComment = await prisma.comment.create({
            data: {
                body: content,
                postId: postId,
                userId: req.userId,
            },
        });
        res.status(201).json({
            msg:"Successfully Created",
            newComment
        });
    } catch (error) {
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