import {blogsCollection, Post, postsCollection} from "./db";

export const postsRepo = {
    async viewAllPosts() {
        return postsCollection.find().toArray()
    },
    async findPostById(id: string) {
        const foundPost = await postsCollection.findOne({id: id})
        if (foundPost) {
            return foundPost
        } else return null
    },
    async createPost(postTitle: string, short: string, text: string, blogId: string) {
        const dateNow = new Date()
        const foundBlog = await blogsCollection.findOne({id: blogId})
        if (foundBlog) {
            const newPost: Post = {
                id: (+dateNow).toString(),
                title: postTitle,
                shortDescription: short,
                content: text,
                blogId: blogId,
                blogName: foundBlog.name,
                createdAt: dateNow.toISOString()
            }
            await postsCollection.insertOne(newPost)
            return newPost
        } else return null
    },
    async updatePost(inputId: string, postTitle: string, short: string, text: string, blogId: string) {
        const foundBlog = await blogsCollection.findOne({id: blogId})
        if (!foundBlog) return null
        const result = await postsCollection.updateOne({id: inputId}, {$set:
                    {title: postTitle,
                    shortDescription: short,
                    content: text, blogId: blogId,
                    blogName: foundBlog.name}
            })
        return result.matchedCount === 1
    },
    async deletePost(inputId: string) {
        const result = await postsCollection.deleteOne({id: inputId})
        return result.deletedCount === 1
    }
}