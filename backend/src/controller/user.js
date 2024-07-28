import prisma from "../../db/db.config.js";
import jwt from "jsonwebtoken";
import uploadOnCloudinary from "../utils/cloudinary.js";

// const varifyToken = (req, res, next) => {
//     const token = req.headers.cookie.split("=")[1];

//     if (!token) {
//       res.status(401).send({ msg: "No token found" });
//     }
//     let payload = jwt.verify(token, process.env.SECRET_KEY);
//     if (payload.email) {
//         req.email=payload.email
//       next();
//     } else res.status(401).send({ msg: "Invalid Token" });
//   };

const getUser = async (req, res) => {

  const user = await prisma.user.findUnique({
    where: {
      email: req.params.email,
    },
    select: {
      bio: true,
      createdAt: true,
      dp: true,
      email: true,
      isVarified: true,
      userID: true,
      username: true,
      posts: {
        select: {
          id: true,
          title: true,
          topic: true,
          body:true,
          createdAt: true,
          updatedAt: true
        }
      },
      comments:{
        select:{
          id:true,
          postId:true,
          parentId:true,
          createdAt:true,
          updatedAt:true
        }
      },
      upvotes:{
        select:{
          id:true,
          upvotes:true,
          postId:true,
          commentId:true,
          createAt:true
        }
      },
      OwnedRooms:{
        select:{
          id:true,
          title:true,
          desc:true,
          privateRoom:true,
          img:true,
          createdAt:true,
          bgImg:true,
          UsersEnrolled:true
        }
      },
      Room:{
        select:{
          id:true,
          userId:true,
          RoomId:true
        }
      }
  }});
  // console.log(user);

  res.status(200).send({
    user,
  });
};
const uploadImg = async (req, res) => {
  let imgurl = null;
  const userId = req.userId;

  if (req.file) {
    imgurl = await uploadOnCloudinary(req.file.path);
    console.log("file Object = " + imgurl);
  }
  try {
    const user = await prisma.user.update({
      where: {
        userID: userId,
      },
      data: {
        dp: imgurl,
      },
    });
    res.status(202).json(user);
  } catch (error) {
    res.status(403).send(error);
  }
};

const getUserPost = async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const offset = (page - 1) * limit;
  console.log(page, offset);

  try {
    const user = await prisma.user.findUnique({
      where: {
        email: req.email,
      },
      select: {
        posts: {
          include: {
            comments: {
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
        },
      },
    });

    res.status(200).send({ posts: user.posts });
  } catch (error) {
    console.log(error);
  }
};

const getNotifications= async (req,res)=>{

  const id= req.userId;
  console.log("id", req.userId);
  
  try {
    const data= await prisma.notification.findMany({
      where:{
        AND:[
          {toUser:id},
          {visited:false}
        ]
      },
      include:{
        user: true,
        user2:true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });
    console.log(data);
    
    
    res.status(202).send({msg:"Success", data});

  } catch (error) {
    console.log(error);
    res.status(403).send({msg:"Some error occured"});
  }

}

const markAsRead=async (req,res)=>{
   const id = req.body.id;
   console.log(req.body);
   
   try {
    const newData = await prisma.notification.update({
      where: {
        id,
      },
      data: {
        visited: true,
      },
    })
    console.log(newData);
    
    res.status(201).send(newData);
   } catch (error) {
    console.log(error);
    
   }
}

const markAllAsRead=async(req,res)=>{
  const id= req.userId;
  try {
    const newData= await prisma.notification.updateMany({
      where:{
        AND:[
          {toUser:id},
          {visited:false}
        ]
      },
      data:{
        visited:true,
      }
    })
    console.log(newData);
    
    res.status(202).send(newData)
  } catch (error) {
    
  }
}

const sendNotification= async (req,res)=>{
  const {toUser, fromUser, postId, title, body} = req.body;
  try {
    const notification= await prisma.notification.create({
      data:{
        title,
        body,
        postId,
        toUser,
        fromUser,
      }
    });
    console.log(notification);
    res.status(201).send(notification);
    
  } catch (error) {
    console.log(error);
    res.status(403).send(error);
  }
}

// const userController={getUser,varifyToken};
const userController = { getUser, uploadImg, getUserPost, getNotifications, markAsRead, markAllAsRead, sendNotification };
export default userController;
