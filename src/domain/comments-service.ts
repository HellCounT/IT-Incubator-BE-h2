import {commentsRepo} from "../repositories/comments-database";
import {CommentCreateType, LikeStatus, StatusType} from "../types/types";
import {ObjectId} from "mongodb";
import {commentsQueryRepo} from "../repositories/queryRepo";
import {likesService} from "./likes-service";

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
        if (foundComment.commentatorInfo.userId === userId.toString()) {
            await commentsRepo.updateComment(commentId, content)
            return {
                status: "Updated",
                code: 204,
                message: "Comment has been updated"
            }
        } else return {
            status: "Forbidden",
            code: 403,
            message: "User is not allowed to edit other user's comment"
        }
    },
    async deleteComment(commentId: string, userId: ObjectId): Promise<StatusType> {
        const foundComment = await commentsQueryRepo.findCommentById(commentId)
        if (!foundComment) return {status: "Not Found"}
        if (foundComment.commentatorInfo.userId === userId.toString()) {
            await commentsRepo.deleteComment(commentId)
            // ALL LIKES AND DISLIKES FOR THIS COMMENT TO BE DELETED FROM REPO!!!!!!!!
            return {
                status: "Deleted",
                code: 204,
                message: 'Comment has been deleted'
            }
        } else return {
            status: "Forbidden",
            code: 403,
            message: "User is not allowed to delete other user's comment"
        }
    },
    async updateLikeStatus(commentId: string, userId: ObjectId, inputLikeStatus: LikeStatus): Promise<StatusType> {
        const foundComment = await commentsQueryRepo.findCommentById(commentId)
        if (!foundComment) {
            return {
                status: "Not Found",
                code: 404,
                message: 'Comment is not found'
            }
        } else {
            const foundUserLike = await commentsQueryRepo.getUserLikeStatusForComment(userId.toString(), commentId)
            let currentLikesCount = foundComment.likesInfo.likesCount
            let currentDislikesCount = foundComment.likesInfo.dislikesCount
            let updatedLikeStatus = inputLikeStatus
            switch (inputLikeStatus) {
                case (LikeStatus.like):
                    if (!foundUserLike || foundUserLike.likeStatus === LikeStatus.none) {
                        currentLikesCount++
                        break
                    }
                    if (foundUserLike.likeStatus === LikeStatus.dislike) {
                        currentLikesCount++
                        currentDislikesCount--
                        break
                    }
                    break
                case (LikeStatus.dislike):
                    if (!foundUserLike || foundUserLike.likeStatus === LikeStatus.none) {
                        currentDislikesCount++
                        break
                    }
                    if (foundUserLike.likeStatus === LikeStatus.like) {
                        currentLikesCount--
                        currentDislikesCount++
                        break
                    }
                    break
                case (LikeStatus.none):
                    if (foundUserLike?.likeStatus === LikeStatus.like) {
                        currentLikesCount--
                        break
                    }
                    if (foundUserLike?.likeStatus === LikeStatus.dislike) {
                        currentDislikesCount--
                        break
                    }
                    break
            }
            if (!foundUserLike) {
                await likesService.createNewLike(commentId, userId.toString(), updatedLikeStatus)
                await
                return {
                    status: "No content",
                    code: 204,
                    message: "Like has been created"
                }

            } else {
                await likesService.updateLikeStatus()
            }
        }

    }
}