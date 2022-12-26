import {Request, Response, Router} from "express";
import {postsDb} from "../repositories/posts-memory";
import {blogsDb} from "../repositories/blogs-memory";
import {blogsCollection, postsCollection} from "../repositories/db";

export const deleteAllRouter = Router({})

deleteAllRouter.delete('/', async (req: Request, res: Response) => {
    await blogsCollection.deleteMany({})
    await postsCollection.deleteMany({})
})

