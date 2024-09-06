import express  from "express"
import { verifyToken } from "../middlewares/verifytoken.js";
import { createPoll, deletePoll, getAllPolls, getPoll, votePoll } from "../controller/poll.js";


const pollRoutes = express.Router();

pollRoutes.get('/getpoll/', getPoll );
pollRoutes.get('/getallpolls/', getAllPolls);
pollRoutes.post('/createpoll', verifyToken, createPoll );
pollRoutes.post('/votepoll', verifyToken, votePoll );
pollRoutes.delete('/deletepoll',verifyToken,deletePoll);


export default pollRoutes;