import express, {Request, Response, Router} from "express";
import {Blog, blogsDb} from "../repositories/blogs-repo";

export const blogsRouter = Router({})

blogsRouter.use(express.json())

blogsRouter.get('/', (req: Request, res: Response) => {
    res.send(blogsDb).status(200);
})

blogsRouter.post('/', (req: Request, res: Response) => {
    // Blog adding
    const dateNow = new Date()
    const addBlog: Blog = {
        id: +dateNow,
        name: req.body.name,
        description: req.body.description,
        websiteUrl: req.body.websiteUrl,
    }
    blogsDb.push(addBlog)

    return res.status(201).send(addBlog)
})

blogsRouter.get('/:id', (req: Request, res: Response) => {
    const blogId: number = +req.params.id
    const foundBlog = blogsDb.find(b => (b.id === blogId))
    if (foundBlog) {
        res.status(200).send(foundBlog)
    } else {
        res.sendStatus(404)
    }
})

blogsRouter.put('/:id', (req: Request, res: Response) => {

})

blogsRouter.delete('/:id', (req: Request, res: Response) => {

})