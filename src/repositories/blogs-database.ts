import {Blog, blogsCollection} from "./db";
import {ObjectId} from "mongodb";

export const blogsRepo = {
    async viewAllBlogs() {
        return blogsCollection.find().toArray()
    },
    async findBlogById(id: string) {
        const foundBlog = await blogsCollection.findOne({id: id})
        if (foundBlog) {
            return foundBlog
        } else return null
    },
    async createBlog(title: string, desc: string, website: string) {
        const dateNow = new Date()
        const newBlog: Blog = {
            id: (+dateNow).toString(),
            name: title,
            description: desc,
            websiteUrl: website,
            createdAt: dateNow.toISOString()
        }
        await blogsCollection.insertOne(newBlog)
        return newBlog
    },
    async updateBlog(inputId: string, title: string, desc: string, website: string) {
        const result = await blogsCollection.updateOne({id: inputId}, {$set:
                    {name: title,
                    description: desc,
                    websiteUrl: website}
            })
        return result.matchedCount === 1
    },
    async deleteBlog(inputId: string) {
        const result = await blogsCollection.deleteOne({id: inputId})
        return result.deletedCount === 1
    }
}