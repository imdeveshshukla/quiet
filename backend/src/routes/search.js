import express from 'express'
import { getUserPosts, getUsers, getUserComments, getUserUpvotes } from '../controller/search.js'
import { getUser } from '../controller/search.js'


const searchRouter = express.Router();

searchRouter.get("/getusers/", getUsers);
searchRouter.get("/getauser/", getUser);
searchRouter.get("/getuserposts/", getUserPosts);
searchRouter.get("/getusercomments/", getUserComments);
searchRouter.get("/getuserupvotes/", getUserUpvotes);


export default searchRouter;