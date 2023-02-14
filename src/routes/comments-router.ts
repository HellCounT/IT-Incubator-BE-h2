import {Request, Response, Router} from "express";
import {commentsService} from "../domain/comments-service";
import {commentDataValidator, inputValidation, likeInputValidator} from "../middleware/data-validation";
import {commentsQueryRepo} from "../repositories/queryRepo";
import {authMiddleware, parseUserIdByToken} from "../middleware/auth-middleware";

export const commentsRouter = Router({})

commentsRouter.get('/:id',
    parseUserIdByToken,
    async (req: Request, res: Response) => {
    const commentIdSearchResult = await commentsQueryRepo.findCommentById(req.params.id, req.user?._id.toString())
    if (commentIdSearchResult) return res.status(200).send(commentIdSearchResult)
    else res.sendStatus(404)
})

commentsRouter.put('/:commentId',
    authMiddleware,
    //InputValidation
    commentDataValidator.contentCheck,
    inputValidation,
    //Handlers
    async (req: Request, res: Response) => {
    const updateStatus = await commentsService.updateComment(req.params.commentId, req.user!._id, req.body.content)
    if (updateStatus.status === "Updated") res.sendStatus(204)
    if (updateStatus.status === "Not Found") res.sendStatus(404)
    if (updateStatus.status === "Forbidden") res.sendStatus(403)
})

commentsRouter.delete('/:commentId',
    authMiddleware,
    //Handlers
    async (req: Request, res: Response) => {
    const deleteStatus = await commentsService.deleteComment(req.params.commentId, req.user!._id)
    if (deleteStatus.status === "Deleted") res.sendStatus(204)
    if (deleteStatus.status === "Not Found") res.sendStatus(404)
    if (deleteStatus.status === "Forbidden") res.sendStatus(403)
})

commentsRouter.put('/:commentId/like-status',
    authMiddleware,
    likeInputValidator,
    inputValidation,
    //Handlers
    async (req: Request, res: Response) => {
        const result = await commentsService.updateLikeStatus(req.params.commentId, req.user?._id, req.body.likeStatus)
        if (result.status === 'No content') res.sendStatus(204)
        if (result.status === 'Not Found') res.sendStatus(404)
    })