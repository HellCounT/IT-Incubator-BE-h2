import {LikeInsertDbType, LikeStatus} from "../types/types";

export const likesService = {
    async createNewLike(commentId: string, userId: string, likeStatus: LikeStatus){
        const newLike: LikeInsertDbType = {
            commentId: commentId,
            userId: userId,
            likeStatus: likeStatus
        }

    },
    async updateLikeStatus() {}
}