import {BlogDbType, blogsCollection, PostDbType, postsCollection, UserInsertDbType, usersCollection} from "./db";
import {ObjectId, WithId} from "mongodb";

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
export type UserViewType = {
    id: string,
    login: string,
    email: string,
    createdAt: string
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
export type UserPaginatorType = {
    pagesCount: number,
    page: number,
    pageSize: number,
    totalCount: number,
    items: UserViewType[]
}

export type QueryParser = {
    searchNameTerm: string | null,
    sortBy: string,
    sortDirection: 1 | -1
    pageNumber: number
    pageSize: number
}
export type UserQueryParser = {
    sortBy: string,
    sortDirection: 1 | -1,
    pageNumber: number,
    pageSize: number,
    searchLoginTerm: string | null,
    searchEmailTerm: string | null
}

export const blogsQueryRepo = {
    async viewAllBlogs(q: QueryParser): Promise<BlogPaginatorType> {
        let filter: string = ""
        if (q.searchNameTerm) filter = ".*" + q.searchNameTerm+ ".*"
        const allBlogsCount = await blogsCollection.countDocuments({"name": {$regex: filter, $options: 'i'}})
        const reqPageDbBlogs = await blogsCollection
            .find({"name": {$regex: filter, $options: 'i'}})
            .sort({[q.sortBy]: q.sortDirection})
            .skip((q.pageNumber - 1) * q.pageSize)
            .limit(q.pageSize)
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
            .limit(q.pageSize)
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
                    .limit(q.pageSize)
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

export const usersQueryRepo = {
    async viewAllUsers(q: UserQueryParser): Promise<UserPaginatorType> {
        let loginFilter: string = ""
        let emailFilter: string = ""
        if (q.searchLoginTerm) loginFilter = ".*" + q.searchLoginTerm+ ".*"
        if (q.searchEmailTerm) emailFilter = ".*" + q.searchEmailTerm+ ".*"
        const allUsersCount = await usersCollection.countDocuments(
            {"login": {$regex: loginFilter, $options: 'i'},
            "email": {$regex: emailFilter, $options: 'i'}}
            )
        const reqPageDbUsers = await usersCollection
            .find(
                {"login": {$regex: loginFilter, $options: 'i'},
                    "email": {$regex: emailFilter, $options: 'i'}}
            )
            .sort({[q.sortBy]: q.sortDirection})
            .skip((q.pageNumber - 1) * q.pageSize)
            .limit(q.pageSize)
            .toArray()
        const pageUsers = reqPageDbUsers.map(u => (usersQueryRepo._mapUserToViewType(u)))
        return {
            pagesCount: Math.ceil(allUsersCount / q.pageSize),
            page: q.pageNumber,
            pageSize: q.pageSize,
            totalCount: allUsersCount,
            items: pageUsers
        }
    },
    _mapUserToViewType(user: WithId<UserInsertDbType>): UserViewType {
        return {
            id: user._id.toString(),
            login: user.login,
            email: user.email,
            createdAt: user.createdAt
        }
    }
}