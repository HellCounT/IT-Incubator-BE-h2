import {Request, Response, Router} from "express";
import {basicAuth} from "../middleware/auth";
import {blogDataValidator, inputValidation, postDataValidator} from "../middleware/data-validation";
import {blogsService} from "../domain/blogs-service";
import {blogsQueryRepo, postsQueryRepo} from "../repositories/queryRepo";
import {postsService} from "../domain/posts-service";

export const blogsRouter = Router({})

blogsRouter.get('/', async (req: Request, res: Response) => {
    res.status(200).send(await blogsQueryRepo.viewAllBlogs());
})

blogsRouter.get('/:id', async (req: Request, res: Response) => {
    const blogIdSearchResult = await blogsQueryRepo.findBlogById(req.params.id)
    if (blogIdSearchResult) {
        res.status(200).send(blogIdSearchResult)
    } else {
        res.sendStatus(404)
    }
})

blogsRouter.get('/:id/posts', async (req: Request, res: Response) => {
    const postsByBlogIdSearchResult = await postsQueryRepo.findPostsByBlogId(req.params.id)
    if (postsByBlogIdSearchResult) {
        res.status(200).send(postsByBlogIdSearchResult)
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

blogsRouter.post('/:id/posts', basicAuth,
    //Input validation
    postDataValidator.titleCheck,
    postDataValidator.shortDescriptionCheck,
    postDataValidator.contentCheck,
    postDataValidator.blogIdCheck,
    inputValidation,
    //Handlers
    async (req: Request, res: Response) => {
        const postAddResult = await postsService.createPost(req.body.title, req.body.shortDescription, req.body.content, req.params.id)
        if (postAddResult) {
            res.status(201).send(postAddResult)
        } else {
            res.sendStatus(400)
        }
    }
    )

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