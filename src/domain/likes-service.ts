import {CommentLikeInsertDbType, LikeStatus, PostLikeInsertDbType} from "../types/types";
import {likesForCommentsRepo} from "../repositories/likes-database";
import {WithId} from "mongodb";

export const likesForCommentsService = {
    async createNewLike(commentId: string, userId: string, likeStatus: LikeStatus): Promise<void> {
        const newLike: CommentLikeInsertDbType = {
            commentId: commentId,
            userId: userId,
            likeStatus: likeStatus
        }
        await likesForCommentsRepo.createNewLike(newLike)
        return
    },
    async updateLikeStatus(commentId: string, userId: string, likeStatus: LikeStatus): Promise<void> {
        await likesForCommentsRepo.updateLikeStatus(commentId, userId, likeStatus)
        return
    },
    async deleteAllLikesWhenCommentIsDeleted(commentId: string): Promise<void> {
        await likesForCommentsRepo.deleteAllLikesWhenCommentIsDeleted(commentId)
        return
    },
}

export const likesForPostsService = {

}