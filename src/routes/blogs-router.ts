import {Request, Response, Router} from "express";
import {basicAuth} from "../middleware/auth";
import {body} from "express-validator";
import {blogDataValidator, inputValidation} from "../middleware/data-validation";
import {blogsService} from "../domain/blogs-service";

export const blogsRouter = Router({})

blogsRouter.get('/', async (req: Request, res: Response) => {
    res.status(200).send(await blogsService.viewAllBlogs());
})

blogsRouter.get('/:id', async (req: Request, res: Response) => {
    const blogIdSearchResult = await blogsService.findBlogById(req.params.id)
    if (blogIdSearchResult) {
        res.status(200).send(blogIdSearchResult)
    } else {
        res.sendStatus(404)
    }
})

blogsRouter.post('/', basicAuth,
    //Input validation
    blogDataValidator.nameCheck,
    blogDataValidator.descriptionCheck,
    blogDataValidator.urlCheck,
    inputValidation,
    //Handlers
    async (req: Request, res: Response) => {
    // Blog adding
    const blogAddResult = await blogsService.createBlog(req.body.name, req.body.description, req.body.websiteUrl)
    return res.status(201).send(blogAddResult)
})

blogsRouter.put('/:id', basicAuth,
    //Input validation
    blogDataValidator.nameCheck,
    blogDataValidator.descriptionCheck,
    blogDataValidator.urlCheck,
    inputValidation,
    //Handlers
    async (req: Request, res: Response) => {
    const flagUpdate = await blogsService.updateBlog(req.params.id, req.body.name, req.body.description, req.body.websiteUrl)
    if (flagUpdate) {
        res.sendStatus(204)
    } else {
        res.sendStatus(404)
    }
})

blogsRouter.delete('/:id', basicAuth, async (req: Request, res: Response) => {
    if (await blogsService.deleteBlog(req.params.id)) {
        res.sendStatus(204)
    } else {
        res.sendStatus(404)
    }
})