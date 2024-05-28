import prisma from '../../db/db.config.js'
import jwt from "jsonwebtoken" ;


const varifyToken = (req, res, next) => {
    const token = req.headers.cookie.split("=")[1];

    if (!token) {
      res.status(401).send({ msg: "No token found" });
    }
    let payload = jwt.verify(token, process.env.SECRET_KEY);
    if (payload.email) {
        req.email=payload.email
      next();
    } else res.status(401).send({ msg: "Invalid Token" });
  };

const getUser=async(req,res)=>{


    const user= await prisma.user.findUnique({
        where:{
            email:req.params.email,
        } ,
        include:{
          posts:{
            include:{
              comments:true
            }
          },
          upvotes:true,
          comments:true,
        }
    })
    console.log(user);
    
    
    res.status(200).send({dp:user?.dp, bio:user?.bio, username:user.username, email:user.email, posts: user.posts, upvotes:user.upvotes, comments:user.comments});
}

const userController={getUser,varifyToken};
export default userController;