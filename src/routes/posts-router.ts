import {Request, Response, Router} from "express";
import {basicAuth} from "../middleware/auth";
import {postDataValidator, inputValidation} from "../middleware/data-validation";
import {postsService} from "../domain/posts-service";
import {postsQueryRepo} from "../repositories/queryRepo";
import {QueryParser} from "../repositories/types";

export const postsRouter = Router({})

postsRouter.get('/', async (req: Request, res: Response) => {
    // query validation and parsing
    let queryParams: QueryParser = {
        searchNameTerm: null,
        sortBy: "createdAt",
        sortDirection: -1,
        pageNumber: 1,
        pageSize: 10
    }
    if (req.query.sortBy) queryParams.sortBy = req.query.sortBy.toString()
    if (req.query.sortDirection && req.query.sortDirection.toString() === "asc") queryParams.sortDirection = 1
    if (req.query.pageNumber) queryParams.pageNumber = +req.query.pageNumber
    if (req.query.pageSize) queryParams.pageSize = +req.query.pageSize
    res.status(200).send(await postsQueryRepo.viewAllPosts(queryParams))
})

postsRouter.get('/:id', async (req: Request, res: Response) => {
    const postIdSearchResult = await postsQueryRepo.findPostById(req.params.id)
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

