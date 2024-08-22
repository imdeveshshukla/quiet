import express from 'express'
import { getUserPosts, getUsers, getUserComments, getUserUpvotes,  getLCdata } from '../controller/search.js'
import { getUser } from '../controller/search.js'


const searchRouter = express.Router();

searchRouter.get("/getusers/", getUsers);
searchRouter.get("/getauser/", getUser);
searchRouter.post("/getLCdata/", getLCdata);
searchRouter.get("/getuserposts/", getUserPosts);
searchRouter.get("/getusercomments/", getUserComments);
searchRouter.get("/getuserupvotes/", getUserUpvotes);



export default searchRouter;