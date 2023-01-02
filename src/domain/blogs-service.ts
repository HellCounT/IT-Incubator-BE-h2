import {blogsRepo} from '../repositories/blogs-database'
import {Blog, BlogDbType, BlogViewType} from "../repositories/db";

const mapBlogToViewType = (blog: BlogDbType): BlogViewType => {
    return {
        id: blog._id.toString(),
        name: blog.name,
        description: blog.description,
        websiteUrl: blog.websiteUrl,
        createdAt: blog.createdAt
    }
}

export const blogsService = {
    async viewAllBlogs(): Promise<BlogViewType[]> {
        const allBLogs = await blogsRepo.viewAllBlogs()
        return allBLogs.map(b => (mapBlogToViewType(b)))
    },
    async findBlogById(id: string): Promise<BlogViewType | null> {
        const foundBlog = await blogsRepo.findBlogById(id)
        if (foundBlog) return mapBlogToViewType(foundBlog)
        else return null
    },
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
    async updateBlog(inputId: string, title: string, desc: string, website: string) {
        return await blogsRepo.updateBlog(inputId, title, desc, website)
    },
    async deleteBlog(inputId: string) {
        return await blogsRepo.deleteBlog(inputId)
    }
}