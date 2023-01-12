import {commentsRepo} from "../repositories/comments-database";
import {CommentCreateType, StatusType} from "../types/types";
import {ObjectId} from "mongodb";
import {commentsQueryRepo} from "../repositories/queryRepo";

export const commentsService = {
    async createComment(postId: string, userId: ObjectId, content: string) {
        const newComment: CommentCreateType = {
            content: content,
            userId: userId.toString(),
            postId: postId,
            createdAt: new Date().toISOString()
        }
        return await commentsRepo.createComment(newComment)
    },
    async updateComment(commentId: string, userId: ObjectId, content: string): Promise<StatusType> {
        const foundComment = await commentsQueryRepo.findCommentById(commentId)
        if (!foundComment) return {status: "Not Found"}
        if (foundComment.userId === userId.toString()) {
            await commentsRepo.updateComment(commentId, content)
            return {status: "Updated"}
        } else return {status: "Forbidden"}
    },
    async deleteComment(commentId: string, userId: ObjectId): Promise<StatusType> {
        const foundComment = await commentsQueryRepo.findCommentById(commentId)
        if (!foundComment) return {status: "Not Found"}
        if (foundComment.userId === userId.toString()) {
            await commentsRepo.deleteComment(commentId)
            return {status: "Deleted"}
        } else return {status: "Forbidden"}
    }
}