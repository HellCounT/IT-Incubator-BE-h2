import {LikeInsertDbType, LikeStatus} from "../types/types";
import {likesRepo} from "../repositories/likes-database";

export const likesService = {
    async createNewLike(commentId: string, userId: string, likeStatus: LikeStatus): Promise<void> {
        const newLike: LikeInsertDbType = {
            commentId: commentId,
            userId: userId,
            likeStatus: likeStatus
        }
        await likesRepo.createNewLike(newLike)
        return
    },
    async updateLikeStatus(commentId: string, userId: string, likeStatus: LikeStatus): Promise<void> {
        await likesRepo.updateLikeStatus(commentId, userId, likeStatus)
        return
    },
    async deleteAllLikesWhenCommentIsDeleted(commentId: string): Promise<void> {
        await likesRepo.deleteAllLikesWhenCommentIsDeleted(commentId)
        return
    }
}