import prisma from "../../db/db.config.js";

export const createComment =async (req,res)=>{
    const { postId,commentId, content } = req.body;
    // console.log("request "+req);
    if(commentId)
    {
        try {
            
            const comment = await prisma.comment.create({
                data:{
                    body:content,
                    postId:postId,
                    parentId:commentId,
                    userId: req.userId
                    
                },
                
            })
            const newComment= await prisma.comment.findUnique({
                where:{
                    id:comment.id,
                },
                include:{
                    user:true,
                    post:true,
                    parent:true,
                },
            })
            return res.status(201).json({
                msg:"Successfully Created",
                newComment:newComment,
            });
        } catch (error) {
            console.log(error);
            return res.status(500).json({ 
                msg: "Failed to create comment",
                error
        });}
    }
    try {
        const comment = await prisma.comment.create({
            data: {
                body: content,
                postId: postId,
                userId: req.userId,
            },
        });
        console.log(comment);
        const newComment= await prisma.comment.findUnique({
            where:{
                id:comment.id,
            },
            include:{
                user:true,
                post:true,
            },
        })
        // console.log(newComment);
        
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
export const deleteComment = async(req,res)=>{
    const userId = req.userId;
    const id = req.body.id;

    try{
        const cmnt = await prisma.comment.findFirst({
            where:{
                id
            }
        });
        console.log(cmnt.userId);
        console.log(userId);
        if(cmnt.userId !== userId)
        {
            return res.status(403).json({
                msg:"You Are Not Authorised"
            })
        }
        await prisma.comment.delete({
            where:{
                id
            }
        });
        return res.status(201).json({
            msg:"Success"
        });
    }
    catch(err)
    {
        return res.status(500).json({
            msg:"Server Issue",
            err
        })
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