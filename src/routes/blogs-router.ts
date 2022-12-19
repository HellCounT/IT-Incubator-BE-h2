import express, {Request, Response, Router} from "express";
import {blogsDb, blogsRepo} from "../repositories/blogs-repo";
import {basicAuth} from "../middleware/auth";

export const blogsRouter = Router({})

blogsRouter.use(express.json())

blogsRouter.get('/', (req: Request, res: Response) => {
    res.send(blogsRepo.viewAllBlogs()).status(200);
})

blogsRouter.get('/:id', (req: Request, res: Response) => {
    const blogIdSearchResult = blogsRepo.findBlogById(req.params.id)
    if (blogIdSearchResult) {
        res.status(200).send(blogIdSearchResult)
    } else {
        res.sendStatus(404)
    }
})

blogsRouter.post('/', basicAuth, (req: Request, res: Response) => {
    // Blog adding
    const blogAddResult = blogsRepo.createBlog(req.body.name, req.body.description, req.body.websiteUrl)
    return res.status(201).send(blogAddResult)
})

blogsRouter.put('/:id', basicAuth, (req: Request, res: Response) => {

})

blogsRouter.delete('/:id', basicAuth, (req: Request, res: Response) => {

})