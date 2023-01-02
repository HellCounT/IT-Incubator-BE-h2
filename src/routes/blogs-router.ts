import {Request, Response, Router} from "express";
import {basicAuth} from "../middleware/auth";
import {body} from "express-validator";
import {inputValidation} from "../middleware/data-validation";
import {blogsService} from "../domain/blogs-service";

export const blogsRouter = Router({})

//Validators
const nameCheck = body('name').exists().isString().trim().isLength({min: 1, max: 15}).withMessage("Name is invalid")
const descriptionCheck = body('description').exists().isString().trim().isLength({min: 1, max: 500}).withMessage("Description is invalid")
const urlCheck = body('websiteUrl').exists().isString().trim().isLength({min: 1, max: 100}).isURL().withMessage("URL is invalid")

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
    nameCheck,
    descriptionCheck,
    urlCheck,
    inputValidation,
    //Handlers
    async (req: Request, res: Response) => {
    // Blog adding
    const blogAddResult = await blogsService.createBlog(req.body.name, req.body.description, req.body.websiteUrl)
    return res.status(201).send(blogAddResult)
})

blogsRouter.put('/:id', basicAuth,
    //Input validation
    nameCheck,
    descriptionCheck,
    urlCheck,
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