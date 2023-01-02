import {BlogDbType, blogsCollection, PostDbType, postsCollection} from "./db";
import {ObjectId} from "mongodb";

export type BlogViewType = {
    id: string,
    name: string,
    description: string,
    websiteUrl: string,
    createdAt: string
}
export type PostViewType = {
    id: string,
    title: string,
    shortDescription: string,
    content: string,
    blogId: string,
    blogName: string,
    createdAt: string,
}

export const postsQueryRepo = {
    async viewAllPosts(): Promise<PostViewType[]> {
        const allPosts = await postsCollection.find({}).toArray()
        return allPosts.map(p => postsQueryRepo._mapPostToViewType(p))
    },
    async findPostById(id: string): Promise<PostViewType| null> {
        if (!ObjectId.isValid(id)) return null
        else {
            const foundPost = await postsCollection.findOne({_id: new ObjectId(id)})
            if (foundPost) return postsQueryRepo._mapPostToViewType(foundPost)
            else return null
        }
    },
    async findPostsByBlogId(id: string): Promise<PostViewType[] | null> {
        if (!ObjectId.isValid(id)) return null
        else {
            if (await blogsQueryRepo.findBlogById(id)) {
                const foundPosts = await postsCollection.find({blogId: {$eq: id}}).toArray()
                if (!foundPosts) return null
                else return foundPosts.map(p => postsQueryRepo._mapPostToViewType(p))
            } else return null
        }
    },
    _mapPostToViewType(post: PostDbType): PostViewType {
    return {
        id: post._id.toString(),
        title: post.title,
        shortDescription: post.shortDescription,
        content: post.content,
        blogId: post.blogId,
        blogName: post.blogName,
        createdAt: post.createdAt
    }}
}

export const blogsQueryRepo = {
    async viewAllBlogs(): Promise<BlogViewType[]> {
        const allBLogs = await blogsCollection.find({}).toArray()
        return allBLogs.map(b => (blogsQueryRepo._mapBlogToViewType(b)))
    },
    async findBlogById(id: string): Promise<BlogViewType | null> {
        if (!ObjectId.isValid(id)) return null
        else {
            const foundBlog = await blogsCollection.findOne({_id: new ObjectId(id)})
            if (foundBlog) return blogsQueryRepo._mapBlogToViewType(foundBlog)
            else return null
        }
    },
    _mapBlogToViewType(blog: BlogDbType): BlogViewType {
        return {
            id: blog._id.toString(),
            name: blog.name,
            description: blog.description,
            websiteUrl: blog.websiteUrl,
            createdAt: blog.createdAt
        }
    }
}