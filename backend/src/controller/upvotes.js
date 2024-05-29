import prisma from "../../db/db.config.js";

export const vote =async(req,res)=>{
    const { postId,val } = req.body;
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
                    upvotes: val,
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
                    upvotes:val
                }
            })
            res.status(201).json({
                msg:"create",
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
                upvotes:1,
                postId
            }
        });
        const downVote = await prisma.upvote.findMany({
            where:{
                upvotes:-1,
                postId
            }
        });
        res.status(200).json({
            msg:"Success",
            numbers:upvote.length,
            downVoteNum:downVote.length,
            upvote:upvote,
            downvote:downVote
        });


    } catch (error) {
        res.status(500).json({
            msg:"Failed",
            error
        })
    }
}