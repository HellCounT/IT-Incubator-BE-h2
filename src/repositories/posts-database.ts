import {blogsCollection, Post, PostDbType, postsCollection, PostViewType} from "./db";
import {ObjectId} from "mongodb";

const mapPostToViewType = (post: PostDbType): PostViewType => {
    return {
        id: post._id.toString(),
        title: post.title,
        shortDescription: post.shortDescription,
        content: post.content,
        blogId: post.blogId,
        blogName: post.blogName,
        createdAt: post.createdAt
    }
}

export const postsRepo = {
    async viewAllPosts(): Promise<PostViewType[]> {
        const allPosts = await postsCollection.find({}).toArray()
        return allPosts.map(p => mapPostToViewType(p))
    },
    async findPostById(id: string): Promise<PostViewType| null> {
        if (ObjectId.isValid(id)) {
            const foundPost = await postsCollection.findOne({_id: new ObjectId(id)})
            if (foundPost) {
                return mapPostToViewType(foundPost)
            } else return null
        } else return null
    },
    async createPost(postTitle: string, short: string, text: string, blogId: string): Promise<PostViewType | null> {
        const foundBlog = await blogsCollection.findOne({_id: new ObjectId(blogId)})
        if (foundBlog) {
            const newPost: Post = {
                title: postTitle,
                shortDescription: short,
                content: text,
                blogId: blogId,
                blogName: foundBlog.name,
                createdAt: new Date().toISOString()
            }
            const result = await postsCollection.insertOne({...newPost})
            return {
                id: result.insertedId.toString(),
                ...newPost
            }
        } else return null
    },
    async updatePost(inputId: string, postTitle: string, short: string, text: string, blogId: string) {
        if (ObjectId.isValid(inputId) && ObjectId.isValid(blogId)) {
            const foundBlog = await blogsCollection.findOne({id: blogId})
            if (!foundBlog) return null
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
        } else return null

    },
    async deletePost(inputId: string) {
        if (ObjectId.isValid(inputId)) {
            const result = await postsCollection.deleteOne({_id: new ObjectId(inputId)})
            return result.deletedCount === 1
        } else return null
    }
}