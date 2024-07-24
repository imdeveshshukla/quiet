import prisma from "../../db/db.config.js";

export const vote = async (req, res) => {
  const { commentId, postId, val } = req.body;
  const uId = req.userId;
  console.log(req.body);

  if (commentId) {
    console.log("Inside comment id " + commentId + " " + postId);
    try {
      const existingUpvote = await prisma.upvote.findFirst({
        where: {
          commentId,
          userId: uId,
        },
        include: {
          post: true,
          comment: true,
        },
      });

      if (existingUpvote) {
        const upvte = await prisma.upvote.update({
          where: {
            id: existingUpvote.id,
          },
          data: {
            upvotes: val,
          },
          include: {
            post: true,
            comment: true,
          },
        });
        return res.status(201).json({
          msg: "Success",
          newUpvote: upvte,
        });
      } else {
        const newupvote = await prisma.upvote.create({
          data: {
            userId: uId,
            postId: postId,
            commentId,
            upvotes: val,
          },
        });

        const newUpvote = await prisma.upvote.findUnique({
          where: {
            id: newupvote.id,
          },
          include: {
            post: true,
            comment: true,
          },
        });
        return res.status(201).json({
          msg: "created",
          newUpvote,
        });
      }
    } catch (error) {
      console.log(error);
      return res.status(500).json({
        msg: "Failed",
        error,
      });
    }
  }
  try {
    console.log("Inside Post " + commentId + " " + postId);
    const existingUpvote = await prisma.upvote.findFirst({
      where: {
        postId,
        userId: uId,
        commentId: null,
      },
      include: {
        post: true,
      },
    });
    console.log("existing", existingUpvote);

    if (existingUpvote) {
      console.log("upvote exists");

      const upvte = await prisma.upvote.update({
        where: {
          id: existingUpvote.id,
        },
        include: {
          post: true,
        },
        data: {
          upvotes: val,
        },
      });
      console.log(upvte);

      res.status(201).json({
        msg: "Success",
        newUpvote: upvte,
      });
    } else {
      console.log("newvotecreating");

      const newupvote = await prisma.upvote.create({
        data: {
          userId: uId,
          postId: postId,
          upvotes: val,
        },
      });

      console.log(newupvote);

      const newUpvote = await prisma.upvote.findUnique({
        where: {
          id: newupvote.id,
        },
        include: {
          post: true,
        },
      });
      res.status(201).json({
        msg: "created",
        newUpvote,
      });
    }
  } catch (error) {
    res.status(500).json({
      msg: "Failed",
      error,
    });
  }
};

export const upvoteNumber = async (req, res) => {
  const { postId, commentId } = req.body;

  if (commentId) {
    try {
      const upvote = await prisma.upvote.findMany({
        where: {
          upvotes: 1,
          postId,
          commentId,
        },
      });
      const downVote = await prisma.upvote.findMany({
        where: {
          upvotes: -1,
          postId,
          commentId,
        },
      });
      return res.status(200).json({
        msg: "Success",
        numbers: upvote.length,
        downVoteNum: downVote.length,
        upvote: upvote,
        downvote: downVote,
      });
    } catch (error) {
      return res.status(500).json({
        msg: "Failed",
        error,
      });
    }
  }

  try {
    const upvote = await prisma.upvote.findMany({
      where: {
        upvotes: 1,
        postId,
      },
    });
    const downVote = await prisma.upvote.findMany({
      where: {
        upvotes: -1,
        postId,
      },
    });
    res.status(200).json({
      msg: "Success",
      numbers: upvote.length,
      downVoteNum: downVote.length,
      upvote: upvote,
      downvote: downVote,
    });
  } catch (error) {
    res.status(500).json({
      msg: "Failed",
      error,
    });
  }
};
