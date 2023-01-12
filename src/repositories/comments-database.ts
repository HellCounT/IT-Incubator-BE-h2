import {ObjectId} from "mongodb";
import {commentsCollection, postsCollection, usersCollection} from "./db";
import {CommentCreateType, CommentInsertDbType, CommentViewType} from "../types/types";

export const commentsRepo = {
    async createComment(newComment: CommentCreateType): Promise<CommentViewType | null> {
        const foundUser = await usersCollection.findOne({_id: new ObjectId(newComment.userId)})
        const foundPost = await postsCollection.findOne({_id: new ObjectId(newComment.postId)})
        if (foundPost && foundUser) {
            const mappedComment: CommentInsertDbType = {
                content: newComment.content,
                userId: newComment.userId,
                userLogin: foundUser.login,
                postId: newComment.postId,
                createdAt: newComment.createdAt
            }
            const result = await commentsCollection.insertOne({...mappedComment})
            return {
                id: result.insertedId.toString(),
                content: mappedComment.content,
                userId: mappedComment.userId,
                userLogin: mappedComment.userLogin,
                createdAt: mappedComment.createdAt
                }
        } else return null
    },
    async updateComment(commentId: string, content: string): Promise<boolean | null> {
        const foundComment = await commentsCollection.findOne({_id: new ObjectId(commentId)})
        if (!foundComment) return null
        else {
            const result = await commentsCollection.updateOne({_id: new ObjectId(commentId)},
                {$set:
            {
                content: content
            }
            })
            return result.matchedCount === 1
        }
    },
    async deleteComment(commentId: string): Promise<boolean | null> {
        if (ObjectId.isValid(commentId)) {
            const result = await commentsCollection.deleteOne({_id: new ObjectId(commentId)})
            return result.deletedCount === 1
        } else return null
    }
}