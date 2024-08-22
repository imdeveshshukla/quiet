import jwt  from "jsonwebtoken";

export const verifyToken = (req, res, next) => {
    const token = req?.headers?.cookie?.split("=")[1];
    try {
      if (!token) {
        return res.status(401).send({ msg: "No token found" });
      }
      let payload = jwt.verify(token, process.env.SECRET_KEY);
      if (payload.email) {
        req.userId = payload.userId;
        req.email = payload.email;
        // console.log("Token varified");
        next();
      } else res.status(401).send({ msg: "Invalid Token" });
      
    } catch (error) {
      return res.status(400).json({
        msg:"Some Error Occured",
        error
      })
    }
};
