import {Request, Response, Router} from "express";
import {basicAuth} from "../middleware/auth";
import {
    postDataValidator,
    inputValidation,
    commentDataValidator,
    paramIdInputValidation
} from "../middleware/data-validation";
import {postsService} from "../domain/posts-service";
import {commentsQueryRepo, postsQueryRepo} from "../repositories/queryRepo";
import {parseQueryPagination} from "../application/queryParsers";
import {QueryParser} from "../types/types";
import {commentsService} from "../domain/comments-service";
import {authMiddleware} from "../middleware/auth-middleware";


export const postsRouter = Router({})

postsRouter.get('/', async (req: Request, res: Response) => {
    // query validation and parsing
    let queryParams: QueryParser = parseQueryPagination(req)
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

postsRouter.get('/:postId/comments',
    //Input validation
    commentDataValidator.postIdParamCheck,
    paramIdInputValidation,
    //Handlers
    async (req: Request, res: Response) => {
        // query validation and parsing
        let queryParams = parseQueryPagination(req)
        const commentsByPostIdSearchResult = await commentsQueryRepo.findCommentsByPostId(req.params.postId, queryParams)
        if (commentsByPostIdSearchResult) res.status(200).send(commentsByPostIdSearchResult)
        else res.sendStatus(404)
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

postsRouter.post('/:postId/comments',
    authMiddleware,
    commentDataValidator.postIdParamCheck,
    paramIdInputValidation,
    commentDataValidator.contentCheck,
    inputValidation,
    async (req: Request, res: Response) => {
    const commentCreateResult = commentsService.createComment(req.params.postId, req.user!._id, req.body.content)
    if (commentCreateResult) return res.status(201).send(commentCreateResult)
    else res.status(400)
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