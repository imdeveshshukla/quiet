import express  from "express"
import { verifyToken } from "../middlewares/verifytoken.js";
import { createPoll, deletePoll, getAllPolls, getHotPolls, getPoll, isPollFromRoom, votePoll } from "../controller/poll.js";


const pollRoutes = express.Router();

pollRoutes.get('/getpoll/', getPoll );
pollRoutes.get('/getpollRoom',verifyToken,isPollFromRoom);
pollRoutes.get('/getallpolls/', getAllPolls);

pollRoutes.get('/q/hottopicspoll',getHotPolls)
pollRoutes.post('/createpoll', verifyToken, createPoll );
pollRoutes.post('/votepoll', verifyToken, votePoll );
pollRoutes.delete('/deletepoll',verifyToken,deletePoll);


export default pollRoutes;