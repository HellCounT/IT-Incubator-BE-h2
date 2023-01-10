import {Request, Response, Router} from "express";
import {commentsService} from "../domain/comments-service";
import {commentDataValidator, inputValidation} from "../middleware/data-validation";
import {commentsQueryRepo} from "../repositories/queryRepo";

export const commentsRouter = Router({})

commentsRouter.get('/:id', async (req: Request, res: Response) => {
    const commentIdSearchResult = await commentsQueryRepo.findCommentById(req.params.id)
    if (commentIdSearchResult) return res.status(200).send(commentIdSearchResult)
    else res.sendStatus(404)
})

commentsRouter.put('/:commentId',
    commentDataValidator.contentCheck,
    inputValidation,
    async (req: Request, res: Response) => {
    const flagUpdate = await commentsService.updateComment(req.params.commentId, req.body.content)
    if (flagUpdate) res.sendStatus(204)
    else res.sendStatus(400)
})

commentsRouter.delete('/:commentId',
    commentDataValidator.contentCheck,
    inputValidation,
    async (req: Request, res: Response) => {
    const flagDelete = await commentsService.deleteComment(req.params.commentId)
    if (flagDelete) res.sendStatus(204)
    else res.sendStatus(400)
})