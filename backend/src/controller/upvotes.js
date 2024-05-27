import prisma from "../../db/db.config.js";

export const upvote =async(req,res)=>{
    const { postId } = req.body;
    const uId = req.userId;
    try {
        const existingUpvote = await prisma.upvote.findFirst({
            where: {
                userId: uId,
                postId: postId,
            },
        });

        if (existingUpvote) {
            // Toggle the upvote status
            const upvte = await prisma.upvote.update({
                where: {
                    id: existingUpvote.id,
                },
                data: {
                    upvoted: !existingUpvote.upvoted,
                },
            });
            res.status(201).json({
                msg:"Success",
                upvte
            })
        }
        else{
            const newUpvote = await prisma.upvote.create({
                data:{
                    userId: uId,
                    postId: postId,
                    upvoted:true
                }
            })
            res.status(201).json({
                msg:"Done",
                newUpvote
            })
        }
    } catch (error) {
        res.status(500).json({
            msg:"Failed",
            error
        })
    }
}

export const upvoteNumber =async (req,res)=>{
    const { postId } = req.body;
    try {
        const upvote = await prisma.upvote.findMany({
            where:{
                upvoted:true
            }
        });
        res.status(200).json({
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