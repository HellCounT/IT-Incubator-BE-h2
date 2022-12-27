import {Blog, blogsCollection} from "./db";

export const blogsRepo = {
    async viewAllBlogs() {
        const result = await blogsCollection.find().toArray()
        const arr = result.map((e) => {
            e.name = e.name
            e.id = e.id
            e.websiteUrl = e.websiteUrl
            e.description = e.description
            e.createdAt = e.createdAt
            })
        return arr
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
        const result = await blogsCollection.insertOne(newBlog)
        await blogsCollection.updateOne({_id: result.insertedId}, {$set:
                {
                    id: result.insertedId.toString()
                }})
        return {
            ...newBlog,
            id: result.insertedId.toString()
        }
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