import {Request, Response, Router} from "express";
import {blogsCollection, postsCollection} from "../repositories/db";

export const deleteAllRouter = Router({})

deleteAllRouter.delete('/all-data', async (req: Request, res: Response) => {
    await blogsCollection.deleteMany({})
    await postsCollection.deleteMany({})
    res.sendStatus(204)
})

