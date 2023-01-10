import {blogsCollection, postsCollection} from "./db";
import {ObjectId} from "mongodb";
import {PostCreateType, PostViewType} from "./types";

export const postsRepo = {
    async createPost(newPost: PostCreateType): Promise<PostViewType | null> {
        const foundBlog = await blogsCollection.findOne({_id: new ObjectId(newPost.blogId)})
        if (foundBlog) {
            const mappedPost = {
                title: newPost.title,
                shortDescription: newPost.shortDescription,
                content: newPost.content,
                blogId: newPost.blogId,
                blogName: foundBlog.name,
                createdAt: newPost.createdAt
            }
            const result = await postsCollection.insertOne({...mappedPost})
            return {
                id: result.insertedId.toString(),
                ...mappedPost
            }
        } else return null
    },
    async updatePost(inputId: string, postTitle: string, short: string, text: string, blogId: string) {
        const foundBlog = await blogsCollection.findOne({_id: new ObjectId(blogId)})
        if (!foundBlog) return null
        else {
            const result = await postsCollection.updateOne({_id: new ObjectId(inputId)}, {$set:
                    {
                        title: postTitle,
                        shortDescription: short,
                        content: text,
                        blogId: blogId,
                        blogName: foundBlog.name
                    }
            })
            return result.matchedCount === 1
        }
    },
    async deletePost(inputId: string) {
        if (ObjectId.isValid(inputId)) {
            const result = await postsCollection.deleteOne({_id: new ObjectId(inputId)})
            return result.deletedCount === 1
        } else return null
    }
}