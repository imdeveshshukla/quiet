import express from 'express'
import { addUser, CreateRoom, deleteRoom, filterName, getAllRoom, getBulk, getRoom, updateRoom } from '../controller/rooms.js';
import { verifyToken } from '../middlewares/verifytoken.js';
import { upload } from '../middlewares/multer.js';

const roomsRouter = express.Router()

roomsRouter.post('/create',verifyToken,upload.single('roomImg'),CreateRoom);
roomsRouter.post('/update',verifyToken,upload.single('roomImg'),updateRoom);
roomsRouter.post('/updatebgImg',verifyToken,upload.single('bgImg'),updateRoom);
roomsRouter.post('/delete',verifyToken,deleteRoom);


roomsRouter.post('/join',verifyToken,addUser)

roomsRouter.get('/titleNameIsUnique',verifyToken,filterName)
roomsRouter.get('/getBulk',verifyToken,getBulk)     //Use for search
roomsRouter.get('/getRoom/:title',verifyToken,getRoom)
roomsRouter.get('/getAllRoom/:userID',verifyToken,getAllRoom);
// roomsRouter.get('/getPosts',verifyToken,getPost);
// roomsRouter.get("/getAPost/:title/:id",verifyToken,getAPost);




export default roomsRouter;