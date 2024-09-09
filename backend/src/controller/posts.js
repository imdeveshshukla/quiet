import prisma from "../../db/db.config.js";
import zod from "zod";
import uploadOnCloudinary from "../utils/cloudinary.js";
import { stringify } from "bigint-json";
const post = zod.object({
  topic: zod.string().optional(),
  title: zod.string(),
  body: zod.string(),
  imgUrl: zod.string().optional(),
  subCommunity: zod.string().optional(),
});
export const createPost = async (req, res) => {
  const postbody = req.body;

  const userId = req.userId;

  let url = null;
  if (req.file) {
    try {
      url = await uploadOnCloudinary(req.file.path);
      // console.log("file Object = " + url);
    } catch (err) {
      console.log("Failed To Upload Image\n",err);
      const message = err.message.split(".")[0]
      // console.log(message)
      return res.status(405).json({
        msg:message
      })
    }
  }
  const parsedBody = post.safeParse(postbody);
  // console.log(parsedBody);

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
        subCommunity: parsedBody.data.subCommunity || null,
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
  const limit = parseInt(req.query.limit) || 15;
  const offset = parseInt(req.query.offset) || 0;
  const roomTitle = req.query?.title;
  // console.log(offset, limit);
  // console.log(roomTitle);

  try {
    const posts = await prisma.post.findMany({
      where: {
        subCommunity: roomTitle ? roomTitle : null,
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
    posts.forEach((item, index) => {
      posts[index].upvotes = posts[index].upvotes?.filter(
        (upvote) => upvote.commentId === null
      );
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
        room:true,
        upvotes: true,
      },
    });
    post.upvotes = post.upvotes.filter((upvote) => upvote.commentId === null);
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
  const topic = req.query.topic || null;
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

export const deletePost = async(req,res) =>{
  const userId = req.userId;
  const id = req.body.id;
  // console.log(id);
  try{
    
    const post = await prisma.post.findFirst({
      where:{
        id
      }
    })
    if(post.userId != userId)
    {
      return res.status(403).json({
        msg:'Unautorised'
      })
    }
    console.log(post);
    const data = await prisma.post.delete({
      where:{
        id
      }
    });
    return res.status(201).json({
      msg:"Success",
      data
    })
  }
  catch(err){
    return res.status(500).json({
      msg:"Server Issue",
      err
    });
  }
}



export const getPopularPosts = async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const offset = (page - 1) * limit;

  try {
    const result = await prisma.$queryRaw`
  SELECT
    p.id,
    p.topic,
    p.title,
    p.body,
    p.img,
    p."userId",
    u."username",
    u."dp",
    p."createdAt",
    p."updatedAt",
    p."subCommunity",
    r."privateRoom",
    r."title" AS "roomTitle",
    r."CreatorId" AS "CreatorId",
    COALESCE((
      SELECT COUNT(*) 
      FROM "Upvote" up 
      WHERE up."postId" = p.id AND up."commentId" IS NULL
    ), 0) AS "upvoteCount",
    COALESCE((
      SELECT COUNT(*) 
      FROM "Comment" c 
      WHERE c."postId" = p.id
    ), 0) AS "commentCount",
    (COALESCE((
      SELECT COUNT(*) 
      FROM "Upvote" up 
      WHERE up."postId" = p.id AND up."commentId" IS NULL
    ), 0) + COALESCE((
      SELECT COUNT(*) 
      FROM "Comment" c 
      WHERE c."postId" = p.id
    ), 0)) AS "popularityScore"
  FROM "Post" p
  LEFT JOIN "User" u ON u."userID" = p."userId"
  LEFT JOIN "Rooms" r ON r."title" = p."subCommunity"
  ORDER BY "popularityScore" DESC, p."createdAt" DESC
  LIMIT ${limit} OFFSET ${offset};
`;


  
let posts = JSON.parse(stringify(result));
console.log(posts);




  posts = posts.filter((p)=>{
    return (p.privateRoom == null || p.privateRoom!=true)
  })
  const postIds = posts.map(post => post.id);
  // console.log("Inside Poular")
  // console.log(posts);
  const upvotes = await prisma.upvote.findMany({
    where: {
      postId: {
        in: postIds,
      },
      commentId: null,
    },
  });


  const upvotesByPostId = upvotes.reduce((acc, upvote) => {
    if (!acc[upvote.postId]) {
      acc[upvote.postId] = [];
    }
    acc[upvote.postId].push(upvote);
    return acc;
  }, {});


  const formattedPosts = posts.map(post => ({
    ...post,
    user: {
      userID: post.userId,
      username: post.username,
      dp:post.dp,
    },
    room:{
      title:post.roomTitle,
      CreatorId: post.CreatorId,
    },
    upvotes: upvotesByPostId[post.id] || [],
  }));

  // console.log(formattedPosts);
  
    res.status(200).send(formattedPosts);
  } catch (error) {
    console.log(error);
  }
};
