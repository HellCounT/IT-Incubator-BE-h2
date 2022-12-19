import {Request, Response, Router} from "express";
import {postsDb} from "../repositories/posts-repo";
import {blogsDb} from "../repositories/blogs-repo";

export const deleteAllRouter = Router({})

deleteAllRouter.delete('/', (req: Request, res: Response) => {
    postsDb.length = 0
    blogsDb.length = 0
    res.sendStatus(204)
})

