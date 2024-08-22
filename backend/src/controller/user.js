import prisma from "../../db/db.config.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import uploadOnCloudinary from "../utils/cloudinary.js";

const getUser = async (req, res) => {
  const email = req.params?.email;
  if (typeof email !== "string")
    return res.status(404).json({ msg: "invalid username" });
  try {
    console.log("email" , email)
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
        leetcode:true,
        showLC:true,
        codeforces:true,
        showCf:true,
        posts: {
          select: {
            id: true,
            title: true,
            topic: true,
            body: true,
            createdAt: true,
            updatedAt: true,
          },
        },
        comments: {
          select: {
            id: true,
            postId: true,
            parentId: true,
            createdAt: true,
            updatedAt: true,
          },
        },
        upvotes: {
          select: {
            id: true,
            upvotes: true,
            postId: true,
            commentId: true,
            createAt: true,
          },
        },
        OwnedRooms: {
          select: {
            id: true,
            title: true,
            desc: true,
            privateRoom: true,
            img: true,
            createdAt: true,
            bgImg: true,
            UsersEnrolled: true,
          },
        },
        Room: {
          select: {
            id: true,
            userId: true,
            RoomId: true,
          },
        },
      },
    });
    console.log(user);

    return res.status(200).send({
      user,
    });
  } catch (error) {
    console.log(error);
    
    return res.status(500).json({
      msg: "Server/Database Error",
      error: error.message,
    });
  }
};

const uploadImg = async (req, res) => {
  // console.log("in controller");

  let imgurl = null;
  const userId = req.userId;

  if (req.file) {
    imgurl = await uploadOnCloudinary(req.file.path);
    // console.log("file Object = " + imgurl);
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

const getNotifications = async (req, res) => {
  const id = req.userId;
  // console.log("Notification :For id", req.userId);

  try {
    const data = await prisma.notification.findMany({
      where: {
        AND: [{ toUser: id }, { visited: false }],
      },
      include: {
        user: true,
        user2: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    res.status(202).send({ msg: "Success", data });
  } catch (error) {
    console.log(error);
    res.status(403).send({ msg: "Some error occured" });
  }
};

const markAsRead = async (req, res) => {
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
    });

    res.status(201).send(newData);
  } catch (error) {
    console.log(error);
  }
};

const markAllAsRead = async (req, res) => {
  const id = req.userId;
  try {
    const newData = await prisma.notification.updateMany({
      where: {
        AND: [{ toUser: id }, { visited: false }],
      },
      data: {
        visited: true,
      },
    });

    res.status(202).send(newData);
  } catch (error) {}
};

const sendNotification = async (req, res) => {
  const { toUser, fromUser, postId, title, body } = req.body;
  try {
    const notification = await prisma.notification.create({
      data: {
        title,
        body,
        postId,
        toUser,
        fromUser,
      },
    });

    res.status(201).send(notification);
  } catch (error) {
    console.log(error);
    res.status(403).send(error);
  }
};

const addLC = async (req, res) => {
  const userID = req.userId
  const  {lcusername}= req.body;
  
  try {
    const data= await prisma.user.update({
      where:{
        userID,
      },
      data:{
        leetcode: lcusername,
      }
    });
    console.log(data);
    
     
    res.status(200).send(data);
  } catch (error) {
    console.log(error);
    
  }
};

const setLcVisibility = async(req,res)=>{
  const userID = req.userId;
  const {showLC}= req.body
  
  
  try {
    const data=await prisma.user.update({
      where:{
        userID,
      },
      data:{
        showLC:showLC,
      }
    })
    console.log(data);
    
     res.status(202).send(data)
  } catch (error) {
    console.log(error);
    
  }
}

const update = async(req,res)=>{
  const body = req.body;
  const userId = req.userId;
  var hashPass = undefined;
  if(body.password)hashPass = bcrypt.hashSync(body.password, 10);

  try {
    const user = await prisma.user.update({
      where:{
        userID:userId,
      },
      data:{
        bio:body.bio?body.bio:undefined,
        username:body.username?body.username:undefined,
        password:hashPass,
        codeforces:body.rank?body.rank:undefined,
        showCf:body.showCF?body.showCF:undefined
      }
    });
    res.status(201).json({
      msg:"Succesfully Updated",
      user
    })
  } catch (error) {
    res.status(500).json({
      msg:"Server/Database Error",
      error
    });
  }
}

const deleteAcct = async(req,res)=>{
  const userID = req.userId;
  try {
    console.log(userID);
    const user = await prisma.user.delete({
      where:{
        userID
      }
    })
    console.log(user);
    return res
    .clearCookie(user?.userID, "", {
      path: "/",
      httpOnly: true,
      sameSite: "lax",
    })
    .status(200)
    .json({
      msg:"Success",
      user
    });
  } catch (error) {
    return res.status(500).json({
      msg:"Server/Database Issue",
      error
    })
  }
}
// const userController={getUser,varifyToken};
const userController = {
  getUser,
  update,
  deleteAcct,
  uploadImg,
  getUserPost,
  getNotifications,
  markAsRead,
  markAllAsRead,
  sendNotification,
  addLC,
  setLcVisibility,
  
};
export default userController;
