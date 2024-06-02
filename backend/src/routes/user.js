import express from 'express'
import userController from '../controller/user.js';
import { verifyToken } from '../middlewares/verifytoken.js';
import { upload } from '../middlewares/multer.js';
const  router = express.Router();


router.get('/:email',verifyToken, userController.getUser );
router.post('/uploadImg',verifyToken,upload.single("profileImg"),userController.uploadImg)

const userRouter= router
export default userRouter; 