import jwt  from "jsonwebtoken";

export const verifyToken = (req, res, next) => {
    const token = req.headers.cookie?.split("=")[1];
    console.log(token);
    try {
      if (!token) {
        res.status(401).send({ msg: "No token found" });
      }
      let payload = jwt.verify(token, process.env.SECRET_KEY);
      if (payload.email) {
        req.userId = payload.userId;
        req.email = payload.email;
        next();
      } else res.status(401).send({ msg: "Invalid Token" });
      
    } catch (error) {
      res.status(401).json({
        msg:"Some Error Occured",
        error
      })
    }
};
