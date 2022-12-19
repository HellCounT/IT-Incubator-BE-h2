import express, {Request, Response, Router} from "express";
import {postsDb} from "../repositories/posts-repo";
import {basicAuth} from "../middleware/auth";

export const postsRouter = Router({})

postsRouter.use(express.json())

postsRouter.get('/', (req: Request, res: Response) => {
    res.send(postsDb).status(200)
})

postsRouter.get('/:id', (req: Request, res: Response) => {
    const postId: string = req.params.id
    const foundPost = postsDb.find(p => (p.id === postId))
    if (foundPost) {
        res.status(200).send(foundPost)
    } else {
        res.sendStatus(404)
    }
})

postsRouter.post('/', basicAuth, (req: Request, res: Response) => {

})

postsRouter.put('/:id', basicAuth, (req: Request, res: Response) => {

})

postsRouter.delete('/:id', basicAuth, (req: Request, res: Response) => {

})

