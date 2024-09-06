import prisma from "../../db/db.config.js";

export const createPoll = async (req, res) => {
  const { title, options,subCommunity } = req.body;
  try {
    const poll = await prisma.poll.create({
      data: {
        title,
        options: {
          create: options.map((option) => ({
            text: option,
          })),
        },
        userId: req.userId,
        subCommunity: subCommunity
      },
    });
    res.status(200).send(poll);
  } catch (error) {
    console.log(error);
  }
};

export const votePoll = async (req, res) => {
  const { pollOptionId } = req.body;
  const userId = req.userId;

  try {
    // Check if the user has already voted on the specific poll option
    let existingVote = await prisma.vote.findFirst({
      where: {
        userId: userId,
        optionId: pollOptionId,
      },
    });

    if (existingVote) {
      return res
        .status(400)
        .send({ error: "User has already voted on this option." });
    }

    // Check if the user has voted on a different option in the same poll
    existingVote = await prisma.vote.findFirst({
      where: {
        userId: userId,
        option: {
          poll: {
            options: {
              some: {
                id: pollOptionId,
              },
            },
          },
        },
      },
    });

    if (existingVote) {
      // If the user has already voted on another option in the same poll, delete the previous vote
      await prisma.vote.delete({
        where: {
          id: existingVote.id,
        },
      });
    }

    // Register the new vote
    const vote = await prisma.vote.create({
      data: {
        optionId: pollOptionId,
        userId: userId,
      },
      include:{
        option:true
      }
    });

   

    res.status(200).send(vote);
  } catch (error) {
    console.error(error);
    res.status(500).send({ error: "Error voting" });
  }
};

export const getPoll = async (req, res) => {
  const id = req.query.id;
  console.log(id);
  

  try {
    const poll = await prisma.poll.findUnique({
      where: { id },
      include: {
        options: {
          include: {
            votes: true,
          },
        },
        createdBy: true,
      },
    });

    if (!poll) {
      return res.status(404).send({ error: "Poll not found" });
    }

    res.status(200).send(poll);
  } catch (error) {
    console.error(error);
    res.status(500).send({ error: "Error fetching poll" });
  }
};


export const getAllPolls= async(req,res)=>{
    
    const limit= parseInt(req.query.limit) ||15;
    const offset= parseInt(req.query.offset) || 0;
    const subCommunity = req.query?.subCommunity;
    
    console.log(limit, offset, subCommunity);
    
    try {
        const poll = await prisma.poll.findMany({
          where:{
            subCommunity:subCommunity?subCommunity:null,
          },
          include: {
            options: {
              include: {
                votes: true,
              },
            },
            createdBy: true,
          },
          orderBy:{
            createdAt: 'desc'
          },
          skip:offset,
          take:limit,
        });
        
        res.status(200).send(poll);
      } catch (error) {
        console.error(error);
        res.status(500).send({ error: "Error fetching poll" });
      }
}

export const deletePoll = async(req,res)=>{
    const id= req.query.id;

    try {
      const poll= await prisma.poll.delete({
        where:{
          id,
        }
      })
      return res.status(202).send(poll);
    } catch (error) {
      res.status(500).send(error)
    }

}

export const isPollFromRoom = async(req,res)=>{
  const userId = req.userId;
  const pollId = req.query?.id;
  console.log("Here it is");
  console.log(userId);
  console.log(pollId);
  try{
    const poll = await prisma.poll.findFirst({
      where:{
        id:pollId
      },
      include:{
        room:{
          include:{
            UsersEnrolled:true
          }
        }
      }
    });

    if(poll?.subCommunity == null)return res.status(200).json({ fetch:true });
    
    // console.log(poll);
    const users = poll.room.UsersEnrolled;
    let found = false;
    users.map((user)=>{
      if(user.userId === userId)
      {
        found = true;
        return;
      }
    })
    return res.status(200).json({fetch:found});
  }
  catch(err)
  {
    console.log(err);
    return res.status(500).json({
      fetch:false,
      msg:"Server Issue"
    })
  }
}