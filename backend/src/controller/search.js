import prisma from "../../db/db.config.js";


export const getUsers = async (req, res) => {
  try {
    const { key } = req.query;
    console.log(req.query);

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
    res.status(200).send(users);
  } catch (error) {}
};

export const getUser = async (req, res) => {
  try {
    const { key } = req.query;
    console.log(req.query);

    let user = await prisma.user.findUnique({
      where: {
        username: key,
      },
      select: {
        userID: true,
        username: true,
        dp: true,
        createdAt: true,
        leetcode:true,
        showLC:true,
        _count: {
          select: {
            posts: true,
            upvotes: true,
            comments: true,
          },
        },
      },
    });
    console.log(user);

    res.status(200).send(user);
  } catch (error) {}
};

export const getUserPosts = async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const offset = parseInt(req.query.offset) || (page - 1) * limit;
  console.log(page, offset);
  const { userID, username } = req.query;

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

    res.status(200).send({ posts: user.posts });
  } catch (error) {
    console.log(error);
  }
};

export const getUserComments = async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const offset = parseInt(req.query.offset) || (page - 1) * limit;
  console.log(page, offset);
  const { userID, username } = req.query;

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

    res.status(200).send(comments);
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
        (upvote) => upvote.commentId === null
      );
    });

    res.status(200).send(data);
  } catch (error) {
    console.log(error);
  }
};


