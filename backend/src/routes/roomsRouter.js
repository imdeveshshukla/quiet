import express from 'express'
import { CreateRoom, deleteRoom, updateRoom } from '../controller/rooms';
import { verifyToken } from '../middlewares/verifytoken';

const roomsRouter = express.Router()

roomsRouter.post('/create',verifyToken,CreateRoom);
roomsRouter.post('/update',verifyToken,updateRoom);
roomsRouter.post('/delete',verifyToken,deleteRoom);

// roomsRouter.get('/:title')

export default roomsRouter;