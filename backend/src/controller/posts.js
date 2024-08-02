import prisma from "../../db/db.config.js";
import zod from "zod";
import uploadOnCloudinary from "../utils/cloudinary.js";
import fs from "fs"
const post = zod.object({
  topic: zod.string().optional(),
  title: zod.string(),
  body: zod.string(),
  imgUrl: zod.string().optional(),
  subCommunity: zod.string().optional()
});
export const createPost = async (req, res) => {
  const postbody = req.body;
  console.log(postbody);

  const userId = req.userId;

  let url = null;
  if (req.file) {
    try{
      url = await uploadOnCloudinary(req.file.path);
      console.log("file Object = " + url);
    }
    catch(err){
      console.log("Failed To Upload Image\n",err);
    }
  }
  const parsedBody = post.safeParse(postbody);
  console.log(parsedBody);

  if (parsedBody.error)
    res.status(405).json({
      msg: "Wrong Input",
    });
  
  try {
    const newpost = await prisma.post.create({
      data: {
        title: parsedBody.data.title,
        topic: parsedBody.data.topic,
        body: parsedBody.data.body,
        img: url,
        userId: userId, //from middleware
        subCommunity:(parsedBody.data.subCommunity)||null,
      },
    });

    console.log(newpost);

    const post = await prisma.post.findUnique({
      where: {
        id: newpost.id,
      },
      include: {
        user: true,
        comments: {
          include: {
            user: true,
          },
        },
        upvotes: true,
      },
    });
    // console.log("post");
    // console.log(post);
    // post = post.reverse();
    res.status(201).json({
      msg: "SuccessFully Created",
      post: post,
    });
  } catch (error) {
    console.log(error);

    res.status(405).json({
      msg: "Some Error Occured",
      error,
    });
  }
};
export const getPost = async (req, res) => {
  const userId = req.userId;
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const offset = (page - 1) * limit;
  const roomTitle = req.query?.title;
  // console.log(offset, limit);
  console.log(roomTitle);
  
  try {
    const posts = await prisma.post.findMany({
      where:{
        subCommunity:roomTitle?roomTitle:null
      },
      include: {
        user: true,
        comments: {
          include: {
            user: true,
          },
        },
        upvotes: true,
      },
      orderBy: {
        createdAt: "desc",
      },
      skip: offset,
      take: limit,
    });
    posts.forEach((item,index)=>{
      posts[index].upvotes = posts[index].upvotes?.filter(upvote => upvote.commentId === null);
    })

    res.status(200).json({
      posts,
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      msg: "some error occured",
    });
  }
};

export const getAPost = async (req, res) => {
  // console.log(offset, limit);

  try {
    const post = await prisma.post.findUnique({
      where: {
        id: req.query.id,
      },
      include: {
        user: true,
        comments: {
          include: {
            user: true,
          },
        },
        upvotes: true,
      },
    });
    post.upvotes = post.upvotes.filter(upvote => upvote.commentId === null);
    res.status(200).json({
      post,
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      msg: "some error occured",
    });
  }
};

export const getHotPost = async (req, res) => {
  const topic= req.query.topic || null;
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const offset = (page - 1) * limit;
  try {
    const posts = await prisma.post.findMany({
      where: {
        topic,
      },
      include: {
        user: true,
        comments: {
          include: {
            user: true,
          },
        },
        upvotes: true,
      },
      orderBy: {
        createdAt: "desc",
      },
      skip: offset,
      take: limit,
    });
    res.status(200).json({ posts });
  } catch (error) {
    res.status(500).send("some Error occured");
  }
};
