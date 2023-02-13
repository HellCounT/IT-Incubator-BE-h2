import {LikeInsertDbType, LikeStatus} from "../types/types";
import {likesCollection} from "./db";

export const likesRepo = {
    async createNewLike(NewLike: LikeInsertDbType): Promise<void> {
        await likesCollection.insertOne(NewLike)
        return
    },
    async updateLikeStatus(commentId: string, userId: string, likeStatus: LikeStatus): Promise<void> {
        console.log(commentId, 'commentId on DB update')
        console.log(userId, 'userId on DB update')
        console.log(likeStatus, 'likeStatus on DB update')
        await likesCollection.updateOne({
            commentId: commentId,
            userId: userId
        }, {
            $set: {
                likeStatus: likeStatus
            }
        })
    },
    async deleteAllLikesWhenCommentIsDeleted(commentId: string): Promise<void> {
        await likesCollection.deleteMany({commentId: commentId})
        return
    }
}