import {blogsCollection, commentsCollection, postsCollection, usersCollection} from "./db";
import {ObjectId, WithId} from "mongodb";
import {
    BlogDbType,
    BlogPaginatorType,
    BlogViewType, CommentInsertDbType, CommentPaginatorType, CommentViewType,
    PostDbType,
    PostPaginatorType,
    PostViewType,
    QueryParser, UserInsertDbType, UserPaginatorType, UserQueryParser, UserViewType
} from "../types/types";

export const blogsQueryRepo = {
    async viewAllBlogs(q: QueryParser): Promise<BlogPaginatorType> {
        let filter: string = ""
        if (q.searchNameTerm) filter = ".*" + q.searchNameTerm + ".*"
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
        }
    }
}

export const commentsQueryRepo = {
    async findCommentsByPostId(postId: string, q: QueryParser): Promise<CommentPaginatorType | null> {
        const foundCommentsCount = await commentsCollection.countDocuments({postId: {$eq: postId}})
        const reqPageDbComments = await commentsCollection.find({postId: {$eq: postId}})
            .sort({[q.sortBy]: q.sortDirection})
            .skip((q.pageNumber - 1) * q.pageSize)
            .limit(q.pageSize)
            .toArray()
        if (!reqPageDbComments) return null
        else {
            const pageCommentsByPostId = reqPageDbComments.map(c => commentsQueryRepo._mapCommentToViewType(c))
            return {
                pagesCount: Math.ceil(foundCommentsCount / q.pageSize),
                page: q.pageNumber,
                pageSize: q.pageSize,
                totalCount: foundCommentsCount,
                items: pageCommentsByPostId
            }
        }
    },
    async findCommentById(id: string): Promise<CommentViewType | null> {
        if (!ObjectId.isValid(id)) return null
        else {
            const foundComment = await commentsCollection.findOne({_id: new ObjectId(id)})
            if (foundComment) return commentsQueryRepo._mapCommentToViewType(foundComment)
            else return null
        }
    },
    _mapCommentToViewType(comment: WithId<CommentInsertDbType>): CommentViewType {
        return {
            id: comment._id.toString(),
            content: comment.content,
            userId: comment.userId,
            userLogin: comment.userLogin,
            createdAt: comment.createdAt
        }
    }

}

export const usersQueryRepo = {
    async viewAllUsers(q: UserQueryParser): Promise<UserPaginatorType> {
        let loginFilter: string = ""
        let emailFilter: string = ""
        if (q.searchLoginTerm) loginFilter = ".*" + q.searchLoginTerm + ".*"
        if (q.searchEmailTerm) emailFilter = ".*" + q.searchEmailTerm + ".*"
        const allUsersCount = await usersCollection.countDocuments(
            {
                $or: [
                    {login: {$regex: loginFilter, $options: 'i'}},
                    {email: {$regex: emailFilter, $options: 'i'}}
                ]
            }
        )
        const reqPageDbUsers = await usersCollection
            .find(
                {
                    $or: [
                        {login: {$regex: loginFilter, $options: 'i'}},
                        {email: {$regex: emailFilter, $options: 'i'}}
                    ]
                }
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
    },
    async findUserById(userId: ObjectId): Promise<WithId<UserInsertDbType> | null> {
        return await usersCollection.findOne({_id: {$eq: userId}})
    }
}