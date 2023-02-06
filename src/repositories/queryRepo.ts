import {activeSessionsCollection, blogsCollection, commentsCollection, postsCollection, usersCollection} from "./db";
import {ObjectId, WithId} from "mongodb";
import {
    ActiveSessionDbType,
    BlogDbType,
    BlogPaginatorType,
    BlogViewType, CommentInsertDbType, CommentPaginatorType, CommentViewType, DeviceViewType, MeViewType,
    PostDbType,
    PostPaginatorType,
    PostViewType,
    QueryParser, UserInsertDbType, UserPaginatorType, UserQueryParser, UserViewType
} from "../types/types";
import {jwtService} from "../application/jwt-service";
import {settings} from "../settings";

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
                        {'accountData.login': {$regex: loginFilter, $options: 'i'}},
                        {'accountData.email': {$regex: emailFilter, $options: 'i'}}
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
            login: user.accountData.login,
            email: user.accountData.email,
            createdAt: user.accountData.createdAt
        }
    },
    async findUserById(userId: ObjectId): Promise<WithId<UserInsertDbType> | null> {
        return await usersCollection.findOne({_id: {$eq: userId}})
    },
    async getMyInfo(token: string): Promise<MeViewType | null> {
        const foundUserId = await jwtService.getUserIdByToken(token, settings.JWT_SECRET)
        if (!foundUserId) return null
        const foundUser = await this.findUserById(foundUserId)
        if (!foundUser) return null
        return {
            email: foundUser.accountData.email,
            login: foundUser.accountData.login,
            userId: foundUserId.toString()
        }
    },
    async getAllSessions(refreshToken: string): Promise<Array<DeviceViewType> | null> {
        const foundUserId = await jwtService.getUserIdByToken(refreshToken, settings.JWT_REFRESH_SECRET)
        if (!foundUserId) return null
        const sessions = await activeSessionsCollection.find({userId: {$eq: foundUserId}}).toArray()
        console.log(sessions.map(e => this._mapDevicesToViewType(e)), 'active sessions')
        return sessions.map(e => this._mapDevicesToViewType(e))
    },
    async findSessionByDeviceId(deviceId: ObjectId): Promise<ActiveSessionDbType | null> {
        return await activeSessionsCollection.findOne({_id: deviceId})
    },
    _mapDevicesToViewType(device: ActiveSessionDbType): DeviceViewType {
        return {
            deviceId: device._id.toString(),
            ip: device.ip,
            title: device.deviceName,
            lastActiveDate: device.issuedAt.toISOString()
        }
    }
}