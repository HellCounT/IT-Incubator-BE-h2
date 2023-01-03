import {Request, Response, Router} from "express";
import {blogsCollection, postsCollection} from "../repositories/db";

export const deleteAllRouter = Router({})

deleteAllRouter.delete('/', async (req: Request, res: Response) => {
    await blogsCollection.deleteMany({})
    await postsCollection.deleteMany({})
    res.sendStatus(204)
})

