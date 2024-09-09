import prisma from "../../db/db.config.js";
import CryptoJS from "crypto-js";
import axios from "axios";

export const getUsers = async (req, res) => {
  try {
    const { key } = req.query;
    // console.log(req.query);

    let limit = 3;
    let users = await prisma.user.findMany({
      where: {
        username: {
          contains: key,
          mode: "insensitive",
        },
      },
      select: {
        username: true,
        dp: true,
        userID: true,
      },
      take: limit,
    });

    let rooms = await prisma.rooms.findMany({
      where: {
        title: {
          contains: key,
          mode: "insensitive",
        },
      },
      select: {
        title: true,
        img: true,
        CreatorId: true,
      },
      take: limit,
    });
    res.status(200).send({ users, rooms });
  } catch (error) {
    console.log(error);
  }
};

export const getUser = async (req, res) => {
  try {
    const { key } = req.query;
    // console.log(req.query);

    let user = await prisma.user.findUnique({
      where: {
        username: key,
      },
      select: {
        userID: true,
        username: true,
        dp: true,
        bio: true,
        bgImg: true,
        createdAt: true,
        leetcode: true,
        showLC: true,
        showCf: true,
        codeforces: true,
        upvotes: true,
        _count: {
          select: {
            posts: true,
            upvotes: true,
            comments: true,
          },
        },
      },
    });
    // console.log("Inside FindUser")
    // console.log(user);
    user.upvotes.forEach((up) => {
      if (up.upvotes == -1) {
        user._count.upvotes--;
      }
    });

    res.status(200).send(user);
  } catch (error) {}
};

export const getUserPosts = async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const offset = parseInt(req.query.offset) || (page - 1) * limit;
  // console.log(page, offset);
  const { userID, username } = req.query;
  // console.log(userID, username);

  try {
    const user = await prisma.user.findUnique({
      where: {
        username,
      },
      select: {
        posts: {
          include: {
            comments: {
              include: {
                user: true,
              },
            },
            room: true,
            user: true,
            upvotes: true,
          },
          orderBy: {
            createdAt: "desc",
          },
          skip: offset,
          take: limit,
        },
      },
    });
    const post = user.posts.filter((post) => {
      return post.room == null || post.room.privateRoom == false;
    });
    res.status(200).send({ posts: post });
  } catch (error) {
    console.log(error);
  }
};

export const getUserPolls = async (req, res) => {
  const userId = req.query.userId;
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const offset =  (page - 1) * limit;
  try {
    const poll = await prisma.poll.findMany({
      where: {
        userId,
      },
      include: {
        options: {
          include: {
            votes: true,
          },
        },
        createdBy: true,
        room:true
      },
      skip:offset,
      take:limit,
    });
    const val = poll.filter((p)=>{
      return !(p.room?.privateRoom)
    })
     return res.status(200).send(val);
  } catch (error) {
      console.log(error);
     return res.status(401).send(error.message);
  }
};

export const getUserComments = async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const offset = parseInt(req.query.offset) || (page - 1) * limit;
  // console.log(page, offset);
  const { userID, username } = req.query;
  // console.log(userID);

  try {
    const comments = await prisma.comment.findMany({
      where: {
        userId: userID,
      },
      include: {
        post: {
          include: {
            room: true,
            user: true,
          },
        },
        parent: {
          include: {
            user: true,
          },
        },
        user: true,
        upvotes: true,
      },
      orderBy: {
        createdAt: "desc",
      },
      skip: offset,
      take: limit,
    });
    const altcomments = comments.filter((cmt)=>{
      return (cmt.post.room == null || cmt.post.room.privateRoom == false);
    })
    // console.log(altcomments);
    
    res.status(200).send(altcomments);
  } catch (error) {
    console.log(error);
  }
};

export const getUserUpvotes = async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const offset = (page - 1) * limit;

  let { userId } = req.query;

  try {
    let data = await prisma.upvote.findMany({
      where: {
        upvotes: 1,
        userId,
        commentId: null,
      },
      include: {
        post: {
          include: {
            user: true,
            comments: true,
            upvotes: true,
            room: true,
          },
        },
      },
      orderBy: {
        createAt: "desc",
      },
      skip: offset,
      take: limit,
    });

    data.forEach((data) => {
      data.post.upvotes = data.post.upvotes.filter(
        (upvote) => {
          return (upvote.commentId === null)
        }
      );
    });
    data = data.filter((data)=>{
      return !(data.post.room?.privateRoom);
    })

    res.status(200).send(data);
  } catch (error) {
    console.log(error);
  }
};

export const getLCdata = async (req, res) => {
  const encryptUsername = req.body.username;

  try {
    const bytes = CryptoJS.AES.decrypt(
      encryptUsername,
      process.env.LC_SECRETKEY
    );
    const username = bytes.toString(CryptoJS.enc.Utf8);
    // console.log("LC_username", username);

    const data = await getLeetCodeData(username);

    const user = data.matchedUser;

    if (!user) {
      res.status(404).send("user not found");
      return;
    }

    const solved = user.submitStats.acSubmissionNum;

    const totalSolved = solved[0].count;
    const easySolved = solved[1].count;
    const mediumSolved = solved[2].count;
    const hardSolved = solved[3].count;

    const succSubmission = solved[0].submissions;
    const totalSubmission = user.submitStats.totalSubmissionNum[0].submissions;
    const acceptanceRate = ((succSubmission / totalSubmission) * 100).toFixed(
      2
    );

    const contributionPoints = user.contributions.points;
    const ranking = user.profile.ranking;

    const allQuestions = data.allQuestionsCount;

    const totalQuestions = allQuestions[0].count;
    const totalEasy = allQuestions[1].count;
    const totalMedium = allQuestions[2].count;
    const totalHard = allQuestions[3].count;

    res.status(200).send({
      ranking,
      totalQuestions,
      totalEasy,
      totalMedium,
      totalHard,
      easySolved,
      mediumSolved,
      hardSolved,
      totalSolved,
      acceptanceRate,
      contributionPoints,
    });
  } catch (error) {
    console.log(error);
  }
};

export const getLeetCodeData = async (username) => {
  try {
    const query = `
    {
      allQuestionsCount {
            difficulty
            count
          }
      matchedUser(username: "${username}") {

        submitStats {
          acSubmissionNum {
            difficulty
            count
            submissions
          }
          totalSubmissionNum {
            difficulty
            count
            submissions
          }
        }
        contributions{
          points
          questionCount
          testcaseCount
        } 
        profile {
          ranking
          reputation          
        }
        
      }
      
    }`;

    const response = await axios.post(
      "https://leetcode.com/graphql",
      { query },
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    let data = response.data.data;
    return data;
  } catch (error) {
    console.log(error);
  }
};
