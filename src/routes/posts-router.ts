import express, {Request, Response, Router} from "express";
import {postsRepo} from "../repositories/posts-repo";
import {basicAuth} from "../middleware/auth";
import {body, CustomValidator} from "express-validator";
import {inputValidation} from "../middleware/data-validation";
import {blogsDb} from "../repositories/blogs-repo";

export const postsRouter = Router({})

postsRouter.use(express.json())

//Validators
const titleCheck = body("title").isString().trim().isLength({min: 1, max: 30}).withMessage("Title is invalid")
const shortDescriptionCheck = body("shortDescription").isString().trim().isLength({min: 1, max: 100}).withMessage("Short description is invalid")
const contentCheck = body("content").isString().trim().isLength({min: 1, max: 1000}).withMessage("Content is invalid")
const isValidBlogId: CustomValidator = (id: string) => {
    if (blogsDb.find(b => (b.id === id))) {
        return true
    } else {
        throw new Error
    }
}
const blogIdCheck = body("blogId").exists().isString().custom(isValidBlogId).withMessage('Invalid parent blog id')

postsRouter.get('/', (req: Request, res: Response) => {
    const postFinderResult = postsRepo.viewAllPosts()
    if (postFinderResult) {
        res.send(postFinderResult).status(200)
    } else res.sendStatus(404)
})

postsRouter.get('/:id', (req: Request, res: Response) => {
    const postIdSearchResult = postsRepo.findPostById(req.params.id)
    if (postIdSearchResult) {
        res.status(200).send(postIdSearchResult)
    } else {
        res.sendStatus(404)
    }
})

postsRouter.post('/', basicAuth,
    //Input validation
    titleCheck,
    shortDescriptionCheck,
    contentCheck,
    blogIdCheck,
    inputValidation,
    //Handlers
    (req: Request, res: Response) => {
    const postAddResult = postsRepo.createPost(req.body.title, req.body.shortDescription, req.body.content, req.body.blogId)
    if (postAddResult) {
        res.status(201).send(postAddResult)
    } else {
        res.sendStatus(400)
    }
})

postsRouter.put('/:id', basicAuth,
    //Input validation
    titleCheck,
    shortDescriptionCheck,
    contentCheck,
    blogIdCheck,
    inputValidation,
    //Handlers
    (req: Request, res: Response) => {
    const flagUpdate = postsRepo.updatePost(req.params.id, req.body.title, req.body.shortDescription, req.body.content, req.body.blogId)
    if (flagUpdate) {
        res.sendStatus(204)
    } else {
        res.sendStatus(404)
    }
})

postsRouter.delete('/:id', basicAuth, (req: Request, res: Response) => {
    if (postsRepo.deletePost(req.params.id)) {
        res.sendStatus(204)
    } else {
        res.sendStatus(404)
    }
})

