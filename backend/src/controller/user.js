import prisma from '../../db/db.config.js'
import jwt from "jsonwebtoken" ;
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

const getUser=async(req,res)=>{


    const user= await prisma.user.findUnique({
        where:{
            email:req.params.email,
        } ,
        include:{
          posts:{
            include:{
              user:true,
              comments:true
            },
            orderBy:{
              id:'desc'
          }
          },
          upvotes:true,
          comments:{
            include:{
              user:true,
            }
          },
        }
    })
    console.log(user);
    
    
    res.status(200).send({dp:user?.dp, userId:user?.userID, bio:user?.bio, username:user.username, email:user.email, posts: user.posts, upvotes:user.upvotes, comments:user.comments});

}
const uploadImg = async(req,res)=>{
  let imgurl=null;
  const userId = req.userId;

  if(req.file){
    imgurl =await uploadOnCloudinary(req.file.path);
    console.log("file Object = "+imgurl);
}
  try {
    const user = await prisma.user.update({
      where:{
        userID:userId
      },
      data:{
        dp:imgurl,
      }
    })
    res.status(202).json(user);
  } catch (error) {
    res.status(403).send(error)
  }
}



// const userController={getUser,varifyToken};
const userController = {getUser, uploadImg};
export default userController;