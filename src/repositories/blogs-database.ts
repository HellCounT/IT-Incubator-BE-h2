import {BlogDbType, blogsCollection, Blog, BlogViewType} from "./db";
import {ObjectId} from "mongodb";

const mapBlogToViewType = (blog: BlogDbType): BlogViewType => {
    return {
        id: blog._id.toString(),
        name: blog.name,
        description: blog.description,
        websiteUrl: blog.websiteUrl,
        createdAt: blog.createdAt
    }
}

export const blogsRepo = {
    async viewAllBlogs(): Promise<BlogViewType[]> {
        const allBLogs = await blogsCollection.find({}).toArray()
        return allBLogs.map(b => (mapBlogToViewType(b)))
    },
    async findBlogById(id: string) {
        if (ObjectId.isValid(id)) {
            const foundBlog = await blogsCollection.findOne({_id: new ObjectId(id)})
            if (foundBlog) {
                return mapBlogToViewType(foundBlog)
            } else return null
        } else return null
    },
    async createBlog(title: string, desc: string, website: string): Promise<BlogViewType> {
        const newBlog: Blog = {
            name: title,
            description: desc,
            websiteUrl: website,
            createdAt: new Date().toISOString()
        }
        const result = await blogsCollection.insertOne({...newBlog})
        return {
            id: result.insertedId.toString(),
            ...newBlog
        }
    },
    async updateBlog(inputId: string, title: string, desc: string, website: string) {
        if (ObjectId.isValid(inputId)) {
            const result = await blogsCollection.updateOne(
                {_id: new ObjectId(inputId)},
                {$set: {
                        name: title,
                        description: desc,
                        websiteUrl: website
                    }})
            return result.matchedCount === 1
        } else return null
    },
    async deleteBlog(inputId: string) {
        if (ObjectId.isValid(inputId)) {
            const result = await blogsCollection.deleteOne({_id: new ObjectId(inputId)})
            return result.deletedCount === 1
        } else return null
    }
}