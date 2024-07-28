import express from 'express'
import { getUsers } from '../controller/search.js'

const searchRouter = express.Router();

searchRouter.get("/getusers", getUsers);

export default searchRouter;