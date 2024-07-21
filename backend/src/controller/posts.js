import prisma from "../../db/db.config.js";
import zod from "zod";
import uploadOnCloudinary from "../utils/cloudinary.js";
const post = zod.object({
  topic: zod.string().optional(),
  title: zod.string(),
  body: zod.string(),
  imgUrl: zod.string().optional(),
});
export const createPost = async (req, res) => {
  const postbody = req.body;
  console.log(postbody);
  
  const userId = req.userId;

  let url = null;
  if (req.file) {
    url = await uploadOnCloudinary(req.file.path);
    console.log("file Object = " + url);
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
      },
    });

    console.log(newpost);
    

    const post = await prisma.post.findUnique({
        where:{
          id:newpost.id,  
        },
        include: {
          user: true,
          comments:{
            include:{
                user:true,
            }
          },
          upvotes: true,
        },
        
      });
    // console.log("post");
    // console.log(post);
    // post = post.reverse();
    res.status(201).json({
      msg: "SuccessFully Created",
      post:post,
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
  // console.log(offset, limit);
  

  try {
    const posts = await prisma.post.findMany({
      include: {
        user: true,
        comments:{
          include:{
            user:true,
          }
        },
        upvotes: true,
      },
      orderBy: {
        createdAt: "desc",
      },
      skip: offset,
      take: limit,
    });
   
    

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
      where:{
        id:(req.query.id),
      },
      include: {
        user: true,
        comments:{
          include:{
            user:true,
          }
        },
        upvotes: true,
      },
      
    });
   
    

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
