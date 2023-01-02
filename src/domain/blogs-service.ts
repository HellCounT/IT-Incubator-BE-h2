import {blogsRepo} from '../repositories/blogs-database'
import {Blog} from "../repositories/db";
import {BlogViewType} from "../repositories/queryRepo";

export const blogsService = {
    async createBlog(title: string, desc: string, website: string): Promise<BlogViewType> {
        const newBlog: Blog = {
            name: title,
            description: desc,
            websiteUrl: website,
            createdAt: new Date().toISOString()
        }
        const result = await blogsRepo.createBlog(newBlog)
        return {
            id: result.insertedId.toString(),
            ...newBlog
        }
    },
    async updateBlog(inputId: string, title: string, desc: string, website: string): Promise<boolean | null> {
        return await blogsRepo.updateBlog(inputId, title, desc, website)
    },
    async deleteBlog(inputId: string): Promise<boolean | null> {
        return await blogsRepo.deleteBlog(inputId)
    }
}