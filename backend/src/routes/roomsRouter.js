import express from 'express'
import { addUser, CreateRoom, deleteRoom, filterName, getBulk, getRoom, updateRoom } from '../controller/rooms.js';
import { verifyToken } from '../middlewares/verifytoken.js';
import { upload } from '../middlewares/multer.js';

const roomsRouter = express.Router()

roomsRouter.post('/create',verifyToken,upload.single('roomImg'),CreateRoom);
roomsRouter.post('/update',verifyToken,upload.single('roomImg'),updateRoom);
roomsRouter.post('/delete',verifyToken,deleteRoom);


roomsRouter.post('/join',verifyToken,addUser)

roomsRouter.get('/titleNameIsUnique',verifyToken,filterName)
roomsRouter.get('/getBulk',verifyToken,getBulk)     //Use for search
roomsRouter.get('/getRoom/:title',verifyToken,getRoom)




export default roomsRouter;