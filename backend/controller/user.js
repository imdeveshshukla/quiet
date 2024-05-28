import prisma from "../db/db.config.js";
import jwt from "jsonwebtoken" ;


const varifyToken = (req, res, next) => {
    const token = req.headers.cookie.split("=")[1];
    console.log(token);
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
        } 
    })
    
    res.status(200).send({dp:user.dp, boi:user.bio, username:user.username, email:user.email, posts: user.posts});
}

const userController={getUser,varifyToken};
export default userController;