import {commentsRepo} from "../repositories/comments-database";
import {CommentCreateType} from "../repositories/types";

export const commentsService = {
    async createComment(postId: string, userId: string, content: string) {
        const newComment: CommentCreateType = {
            content: content,
            userId: userId,
            postId: postId,
            createdAt: new Date().toISOString()
        }
        return await commentsRepo.createComment(newComment)
    },
    async updateComment(commentId: string, content: string): Promise<boolean | null> {
      return await commentsRepo.updateComment(commentId, content)
    },
    async deleteComment(commentId: string): Promise<boolean | null> {
        return await commentsRepo.deleteComment(commentId)
    }
}