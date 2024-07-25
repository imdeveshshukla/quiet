import express from 'express'
import authController from '../controller/auth.js';
const  router = express.Router();
import rateLimit from 'express-rate-limit';
router.get("/",(req,res)=>{
    res.json({
        msg:"Healthy"
    });
})
const otpLimit = rateLimit({
    windowsMs: 15*60*1000, //15 minutes
    max: 4,//number of times
    message: 'Too Many requests, please try again after some minutes',
    standardHeaders:true,
    legacyHeaders:false
})

const passLimit = rateLimit({
    windowMs:15*60*1000,
    max:6,//number of times
    message:'Too many request, please try again after some times',
    standardHeaders:true,
    legacyHeaders:false
})

router.post('/signup', authController.signup);
router.post('/varifyotp',passLimit,authController.varifyOtp);
router.post('/resendotp',otpLimit, authController.resendOtp);
router.post('/resetpass', authController.resetPassword);
router.post('/updatepass', authController.updatePassword);
router.post('/signin', passLimit,authController.signin);
router.post('/refreshsignin', authController.refreshSignIn)
router.post('/logout', authController.logout)
router.post('/testing', authController.testing) 

const authRouter= router
export default authRouter; 