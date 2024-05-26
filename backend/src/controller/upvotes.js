import prisma from "../../db/db.config";

export const upvote =async(req,res)=>{
    const { postId } = req.body;
    const uId = req.userId;
    try {
        const upvte = await prisma.upvote.update({
            where:{
                userId:uId,
                postId
            },
            upvoted:false
        })
        res.status(201).json({
            msg:"Success",
            upvte
        })
    } catch (error) {
        res.status(500).json({
            msg:"Failed",
            error
        })
    }
}

export const upvoteNumber =async (req,res)=>{
    try {
        const upvote = await prisma.upvote.findMany({
            where:{
                upvoted:true
            }
        });
        res.status(201).json({
            msg:"Success",
            numbers:upvote.length,
            upvote
        });

    } catch (error) {
        res.status(500).json({
            msg:"Failed",
            error
        })
    }
}