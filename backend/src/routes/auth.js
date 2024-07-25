import express from 'express'
import authController from '../controller/auth.js';
const  router = express.Router();

router.get("/",(req,res)=>{
    res.json({
        msg:"Healthy"
    });
})
router.post('/signup', authController.signup);
router.post('/varifyotp', authController.varifyOtp);
router.post('/resendotp', authController.resendOtp);
router.post('/resetpass', authController.resetPassword);
router.post('/updatepass', authController.updatePassword);
router.post('/signin', authController.signin);
router.post('/refreshsignin', authController.refreshSignIn)
router.post('/logout', authController.logout)
router.get('/generateusername', authController.generateUsername);
router.post('/testing', authController.testing) 

const authRouter= router
export default authRouter; 