import {Request, Response, Router} from "express";
import {basicAuth} from "../middleware/auth";
import {postDataValidator, inputValidation} from "../middleware/data-validation";
import {postsService} from "../domain/posts-service";

export const postsRouter = Router({})

postsRouter.get('/', async (req: Request, res: Response) => {
    res.status(200).send(await postsService.viewAllPosts())
})

postsRouter.get('/:id', async (req: Request, res: Response) => {
    const postIdSearchResult = await postsService.findPostById(req.params.id)
    if (postIdSearchResult) {
        res.status(200).send(postIdSearchResult)
    } else {
        res.sendStatus(404)
    }
})

postsRouter.post('/', basicAuth,
    //Input validation
    postDataValidator.titleCheck,
    postDataValidator.shortDescriptionCheck,
    postDataValidator.contentCheck,
    postDataValidator.blogIdCheck,
    inputValidation,
    //Handlers
    async (req: Request, res: Response) => {
    const postAddResult = await postsService.createPost(req.body.title, req.body.shortDescription, req.body.content, req.body.blogId)
    if (postAddResult) {
        res.status(201).send(postAddResult)
    } else {
        res.sendStatus(400)
    }
})

postsRouter.put('/:id', basicAuth,
    //Input validation
    postDataValidator.titleCheck,
    postDataValidator.shortDescriptionCheck,
    postDataValidator.contentCheck,
    postDataValidator.blogIdCheck,
    inputValidation,
    //Handlers
    async (req: Request, res: Response) => {
    const flagUpdate = await postsService.updatePost(req.params.id, req.body.title, req.body.shortDescription, req.body.content, req.body.blogId)
    if (flagUpdate) {
        res.sendStatus(204)
    } else {
        res.sendStatus(404)
    }
})

postsRouter.delete('/:id', basicAuth, async (req: Request, res: Response) => {
    if (await postsService.deletePost(req.params.id)) {
        res.sendStatus(204)
    } else {
        res.sendStatus(404)
    }
})

