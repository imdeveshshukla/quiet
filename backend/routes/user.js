import express from 'express'
import userController from '../controller/user.js';
const  router = express.Router();


router.get('/:email',userController.varifyToken, userController.getUser );


const userRouter= router
export default userRouter; 