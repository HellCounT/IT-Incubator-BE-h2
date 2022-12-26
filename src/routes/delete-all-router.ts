import {Request, Response, Router} from "express";
import {postsDb} from "../repositories/posts-memory";
import {blogsDb} from "../repositories/blogs-memory";

export const deleteAllRouter = Router({})

deleteAllRouter.delete('/', (req: Request, res: Response) => {
    postsDb.length = 0
    blogsDb.length = 0
    res.sendStatus(204)
})

