import {Blog, BlogDbType, blogsCollection, Post, PostDbType, postsCollection} from "./db";
import {Filter, ObjectId} from "mongodb";

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
export type BlogPaginatorType = {
    pagesCount: number,
    page: number,
    pageSize: number,
    totalCount: number,
    items: BlogViewType[]
}
export type PostPaginatorType = {
    pagesCount: number,
    page: number,
    pageSize: number,
    totalCount: number,
    items: PostViewType[]
}

export type QueryParser = {
    searchNameTerm: string | null,
    sortBy: string,
    sortDirection: 1 | -1
    pageNumber: number
    pageSize: number
}

export const blogsQueryRepo = {
    async viewAllBlogs(q: QueryParser): Promise<BlogPaginatorType> {
        const filter: Filter<Blog> = {}
        if (q.searchNameTerm) {
            filter.name = q.searchNameTerm
        }
        const allBlogsCount = await blogsCollection.countDocuments(filter)
        const reqPageDbBlogs = await blogsCollection
            .find(filter)
            .sort({[q.sortBy]: q.sortDirection})
            .skip((q.pageNumber - 1) * q.pageSize)
            .limit(q.pageNumber * q.pageSize)
            .toArray()
        const pageBlogs = reqPageDbBlogs.map(b => (blogsQueryRepo._mapBlogToViewType(b)))
        return {
            pagesCount: Math.ceil(allBlogsCount / q.pageSize),
            page: q.pageNumber,
            pageSize: q.pageSize,
            totalCount: allBlogsCount,
            items: pageBlogs
        }
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

export const postsQueryRepo = {
    async viewAllPosts(q: QueryParser): Promise<PostPaginatorType> {
        const allPostsCount = await postsCollection.countDocuments()
        const reqPageDbPosts = await postsCollection.find()
            .sort({[q.sortBy]: q.sortDirection})
            .skip((q.pageNumber - 1) * q.pageSize)
            .limit(q.pageNumber * q.pageSize)
            .toArray()
        const pagePosts = reqPageDbPosts.map(p => postsQueryRepo._mapPostToViewType(p))
        return {
            pagesCount: Math.ceil(allPostsCount / q.pageSize),
            page: q.pageNumber,
            pageSize: q.pageSize,
            totalCount: allPostsCount,
            items: pagePosts
        }
    },
    async findPostById(id: string): Promise<PostViewType | null> {
        if (!ObjectId.isValid(id)) return null
        else {
            const foundPost = await postsCollection.findOne({_id: new ObjectId(id)})
            if (foundPost) return postsQueryRepo._mapPostToViewType(foundPost)
            else return null
        }
    },
    async findPostsByBlogId(id: string, q: QueryParser): Promise<PostPaginatorType | null> {
        if (!ObjectId.isValid(id)) return null
        else {
            if (await blogsQueryRepo.findBlogById(id)) {
                const foundPostsCount = await postsCollection.countDocuments({blogId: {$eq: id}})
                const reqPageDbPosts = await postsCollection.find({blogId: {$eq: id}})
                    .sort({[q.sortBy]: q.sortDirection})
                    .skip((q.pageNumber - 1) * q.pageSize)
                    .limit(q.pageNumber * q.pageSize)
                    .toArray()
                if (!reqPageDbPosts) return null
                else {
                    const pagePostsByBlog = reqPageDbPosts.map(p => postsQueryRepo._mapPostToViewType(p))
                    return {
                        pagesCount: Math.ceil(foundPostsCount / q.pageSize),
                        page: q.pageNumber,
                        pageSize: q.pageSize,
                        totalCount: foundPostsCount,
                        items: pagePostsByBlog
                    }
                }
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