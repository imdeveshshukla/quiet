import express from 'express'
import { CreateRoom, deleteRoom, filterName, getBulk, getRoom, updateRoom } from '../controller/rooms.js';
import { verifyToken } from '../middlewares/verifytoken.js';
import { upload } from '../middlewares/multer.js';

const roomsRouter = express.Router()

roomsRouter.post('/create',verifyToken,upload.single("otherImg"),CreateRoom);
roomsRouter.post('/update',verifyToken,upload.single("otherImg"),updateRoom);
roomsRouter.post('/delete',verifyToken,deleteRoom);



roomsRouter.get('/titleNameIsUnique',verifyToken,filterName)
roomsRouter.get('/getBulk',verifyToken,getBulk)     //Use for search
roomsRouter.get('/getRoom/:title',verifyToken,getRoom)



export default roomsRouter;