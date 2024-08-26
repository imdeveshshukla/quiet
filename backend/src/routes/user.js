import express from 'express'
import userController from '../controller/user.js';
import { verifyToken } from '../middlewares/verifytoken.js';
import { upload } from '../middlewares/multer.js';
const  router = express.Router();


router.get('/getuserpost',verifyToken, userController.getUserPost );
router.post('/uploadImg',verifyToken,upload.single("profileImg"),userController.uploadImg)
router.post('/updatebg',verifyToken,upload.single("bgImg"),userController.updateBg)
router.get('/notification',verifyToken, userController.getNotifications);
router.post('/markasread', userController.markAsRead );
router.post('/markallasread',verifyToken, userController.markAllAsRead );
router.post("/sendnotification",verifyToken,userController.sendNotification);
router.post("/addLeetCode",verifyToken,userController.addLC);
router.post("/setLcVisibility",verifyToken,userController.setLcVisibility);
router.post("/update",verifyToken,userController.update);
router.delete("/deleteAccount",verifyToken,userController.deleteAcct);
router.get('/:email',verifyToken, userController.getUser );



const userRouter= router
export default userRouter; 