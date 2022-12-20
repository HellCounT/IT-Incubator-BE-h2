import express, {Request, Response, Router} from "express";
import {blogsRepo} from "../repositories/blogs-repo";
import {basicAuth} from "../middleware/auth";
import {body} from "express-validator";
import {inputValidation} from "../middleware/data-validation";

export const blogsRouter = Router({})

blogsRouter.use(express.json())

//Validators
const nameCheck = body('name').exists().isString().trim().isLength({min: 1, max: 15}).withMessage("Name is invalid")
const descriptionCheck = body('description').exists().isString().trim().isLength({min: 1, max: 500}).withMessage("Description is invalid")
const urlCheck = body('websiteUrl').exists().isString().trim().isLength({min: 1, max: 100}).isURL().withMessage("URL is invalid")

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

blogsRouter.post('/', basicAuth,
    //Input validation
    nameCheck,
    descriptionCheck,
    urlCheck,
    inputValidation,
    //Handlers
    (req: Request, res: Response) => {
    // Blog adding
    const blogAddResult = blogsRepo.createBlog(req.body.name, req.body.description, req.body.websiteUrl)
    return res.status(201).send(blogAddResult)
})

blogsRouter.put('/:id', basicAuth,
    //Input validation
    nameCheck,
    descriptionCheck,
    urlCheck,
    inputValidation,
    //Handlers
    (req: Request, res: Response) => {
    const flagUpdate = blogsRepo.updateBlog(req.params.id, req.body.name, req.body.description, req.body.websiteUrl)
    if (flagUpdate) {
        res.sendStatus(204)
    } else {
        res.sendStatus(404)
    }
})

blogsRouter.delete('/:id', basicAuth, (req: Request, res: Response) => {
    if (blogsRepo.deleteBlog(req.params.id)) {
        res.sendStatus(204)
    } else {
        res.sendStatus(404)
    }
})