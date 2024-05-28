import prisma from "../db/db.config.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken" ;
import nodemailer from "nodemailer" ;

// const { z } =require("zod");

// const User = z.object({
//     id: z.string(),
//     username: z.string(),
//     email: z.string(),
//     password: z.string(),
//     isVarified: z.boolean(),
//   });

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.AUTH_EMAIL,
    pass: process.env.AUTH_PASS,
  },
});

const sendEmailVarification = async ({ userID, email }, res) => {
  try {
    console.log(userID, email);

    const otp = `${Math.floor(1000 + Math.random() * 9000)}`;
    const hashOtp = await bcrypt.hash(otp, 10);

    const mailOptions = {
      from: process.env.AUTH_EMAIL,
      to: email,
      subject: "Varify Your Email",
      text: `Your OTP code for quIET is: ${otp}. It will expire in 3 minutes`,
    };

    transporter.sendMail(mailOptions, async (error, info) => {
      if (error) {
        return res.status(500).send({ message: "Error sending email", error });
      }
      const isUser = await prisma.userVarify.findUnique({
        where: {
          userID: userID,
        },
      });
      console.log(isUser);

      if (isUser) {
        const updateUser = await prisma.userVarify.update({
          where: {
            userID: userID,
          },
          data: {
            otp: hashOtp,
            createdAt: Date.now(),
            expiresAt: Date.now() + 180000,
          },
        });
        console.log(updateUser);
      } else {
        const userdata = await prisma.userVarify.create({
          data: {
            userID: userID,
            otp: hashOtp,
            createdAt: Date.now(),
            expiresAt: Date.now() + 180000,
          },
        });
        console.log(userdata);
      }

      res
        .status(202)
        .send({ msg: "OTP sent success", userID: userID, email: email });
    });
  } catch (error) {
    console.log(error);
  }
};
const signup = async (req, res) => {
  try {
    const { username, email, password } = req.body;
    if (username == "" || email == "" || password == "") {
      res.json({ message: "Credentials cannot be empty" });
    }
    const hashPass = bcrypt.hashSync(password, 10);
    var token = jwt.sign({ email: email }, process.env.SECRET_KEY, {
      expiresIn: "1d",
    });
    const isUser = await prisma.user.findUnique({
      where: {
        email: email,
      },
    });
    const isuser = await prisma.user.findUnique({
      where: {
        username: username,
      },
    });
    if (isUser || isuser) {
      res.status(400).json({ res: "User Already Exists" });
    } else {
      const newUser = await prisma.user.create({
        data: {
          username: username,
          email: email,
          password: hashPass,
        },
      });
      console.log(newUser);
      await sendEmailVarification(newUser, res);
    }
  } catch (error) {
    console.log(error);
  }
};
const  varifyOtp = async (req, res) => {
  try {
    const { userID, otp } = req.body;
    if (userID == "" || otp == "") {
      throw Error(" credetials cannot be empty");
    } else {
      const varData = await prisma.userVarify.findUnique({
        where: { userID: userID },
      });
      if (!varData)
        return res
          .status(500)
          .send({ message: "User has been varified already. Please SignIn" });
      const hashOtp = varData.otp;
      const expiresAt = varData.expiresAt;
      if (expiresAt < Date.now()) {
        const deleteVarDetail = await prisma.userVarify.delete({
          where: {
            userID: userID,
          },
        });
        return res.status(403).json({ msg: "Otp has expired. Resend it!" });
      }

      const validOtp = bcrypt.compareSync(otp, hashOtp);
      if (!validOtp) {
        return res.status(401).json({ msg: "Invalid Otp" });
      }
      const updateUser = await prisma.user.update({
        where: {
          userID: userID,
        },
        data: {
          isVarified: true,
        },
      });

      const deleteVarDetail = await prisma.userVarify.delete({
        where: {
          userID: userID,
        },
      });

      return res.status(202).json({ msg: "User successfully Varified" });
    }
  } catch (error) {
    console.log(error);
  }
};
const resendOtp = async (req, res) => {
  console.log(req.body);
  try {
    await sendEmailVarification(req.body, res);
  } catch (error) {
    console.log(error);
  }
};

const resetPassword = async (req, res) => {
  const { email } = req.body;
  console.log(req.body);

  const user = await prisma.user.findUnique({
    where: {
      email: email,
    },
  });
  if (!user) {
    return res.status(404).send({ msg: "User doesn't exists" });
  } else {
    await sendEmailVarification(user, res);
  }
};

const updatePassword = async (req, res) => {
  const { userID, password } = req.body;
  const user = await prisma.user.findUnique({
    where: {
      userID: userID,
    },
  });
  const hashPass = bcrypt.hashSync(password, 10);

  if (!user) {
    return res.status(400).send({ msg: "Try Again" });
  }

  const updateUser = await prisma.user.update({
    where: {
      userID: userID,
    },
    data: {
      password: hashPass,
    },
  });

  if (!updateUser) {
    return res.status(304).send({ msg: "cannot update please try again" });
  }

  return res.status(201).send(updateUser);
};

const signin = async (req, res) => {
  try {
    const { username, email, password } = req.body;
    console.log(req.body);

    const user = await prisma.user.findMany({
      where: {
        OR: [
          {
            email: email,
            username: username,
          },
        ],
      },
    });
    console.log(user);

    if (!user) {
      return res.status(401).json({ msg: "Incorrect Credentials" });
    }

    var token = jwt.sign({ email: user[0].email }, process.env.SECRET_KEY, {
      expiresIn: 24 * 60 * 60,
    });
    console.log(token);

    const hashPass = user[0].password;
    const isVarified = user[0].isVarified;
    const validPass = bcrypt.compareSync(password, hashPass);
    console.log(validPass);

    if (!validPass) {
      return res.status(401).json({ msg: "Incorrect Credentials" });
    }

    if (!isVarified) {
      res.status(403).send({ msg: "User is not varified!" });
    }

    res
      .cookie(user[0].userID, token, {
        path: "/",
        expires: new Date(Date.now() + 1000 * 1 * 24 * 60 * 60),
        httpOnly: true,
        sameSite: "lax",
      })
      .status(202)
      .send(user[0].email);
  } catch (error) {
    console.log(error);
  }
};

const varifyToken = (req, res, next) => {
  console.log(req.headers.cookie);
  
  const token = req.headers.cookie.split("=")[1];
  console.log(token);
  if (!token) {
    res.status(401).send({ msg: "No token found" });
  }
  let payload = jwt.verify(token, process.env.SECRET_KEY);
  if (payload.email) {
    next();
  } else res.status(401).send({ msg: "Invalid Token" });
};

const refreshSignIn = async (req, res) => {
  try {
    if (req.headers.cookie) {
      const token = req.headers.cookie.split("=")[1];
      if (!token) {
        res.status(404).send({ msg: "No token found" });
      }
      let payload = jwt.verify(token, process.env.SECRET_KEY);
      if (payload.email) {
        res.status(200).send(payload.email);
      } else {
        res.status(401).send({ msg: "Invalid Token" });
      }
    } else {
      res.status(404).send({ msg: "token not found" });
    }
  } catch (error) {
    console.log(error);
  }
};

const logout = async (req, res) => {
  try {
    const token = req.headers.cookie.split("=")[1];
    console.log(token);
    if (!token) {
      res.status(404).send({ msg: "No token found" });
    }
    let payload = jwt.verify(token, process.env.SECRET_KEY);
    if (payload.email) {
      const user = await prisma.user.findUnique({
        where: { email: payload.email },
      });
      console.log(user.email);

      res
        .cookie(user.userID, "", {
          path: "/",
          expires: new Date(Date.now() + 1000 * 1),
          httpOnly: true,
          sameSite: "lax",
        })
        .status(200)
        .send(user.email);
    } else res.status(401).send({ msg: "Invalid Token" });
    console.log(req.body.email);
  } catch (error) {
    throw error;
  }
};

const testing = async (req, res) => {
  const deleteUsers = await prisma.user.deleteMany({
    where: {
      email: {
        contains: "@",
      },
    },
  });
  const deleteUs = await prisma.userVarify.deleteMany({
    where: {
      userID: {
        contains: "-",
      },
    },
  });
  res.json({ msg: "deleted" });
};
const authController={signup, signin, logout, varifyOtp, varifyToken , resendOtp, resetPassword, updatePassword, refreshSignIn,testing}

export default authController