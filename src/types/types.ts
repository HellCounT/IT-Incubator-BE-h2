import {ObjectId} from "mongodb";

export type Blog = {
    name: string,
    description: string,
    websiteUrl: string,
    createdAt: string,
}
export type BlogDbType = {
    _id: ObjectId
    name: string,
    description: string,
    websiteUrl: string,
    createdAt: string,
}
export type Post = {
    title: string,
    shortDescription: string,
    content: string,
    blogId: string,
    blogName: string,
    createdAt: string,
}
export type PostDbType = {
    _id: ObjectId
    title: string,
    shortDescription: string,
    content: string,
    blogId: string,
    blogName: string,
    createdAt: string,
}
export type PostCreateType = {
    title: string,
    shortDescription: string,
    content: string,
    blogId: string,
    createdAt: string,
}
export type UserInsertDbType = {
    accountData: {
        login: string,
        email: string,
        hash: string,
        createdAt: string,
    },
    emailConfirmationData: {
        confirmationCode: string,
        expirationDate: string,
        isConfirmed: boolean,
    },
    recoveryCodeData?: {
        recoveryCode: string,
        expirationDate: string,
    }
}
export type UserCreateType = {
    login: string,
    password: string,
    email: string,
    createdAt: string,
    confirmationCode: string,
    expirationDate: string,
    isConfirmed: boolean
}
export type CommentCreateType = {
    content: string,
    userId: string,
    postId: string,
    createdAt: string
}
export type CommentInsertDbType = {
    content: string,
    userId: string,
    userLogin: string,
    postId: string,
    createdAt: string
}
export type ExpiredTokenInsertDbType = {
    userId: ObjectId,
    refreshToken: string,
}
export type ActiveSessionDbType = {
    _id: ObjectId, //Session Device ID
    userId: ObjectId,
    ip: string,
    deviceName: string,
    issuedAt: Date,
    expirationDate: Date,
    refreshTokenMeta: string
}


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
export type MeViewType = {
    email: string,
    login: string,
    userId: string
}
export type CommentViewType = {
    id: string,
    content: string,
    userId: string,
    userLogin: string,
    createdAt: string
}
export type DeviceViewType = {
    ip: string,
    title: string,
    lastActiveDate: string,
    deviceId: string
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
export type CommentPaginatorType = {
    pagesCount: number,
    page: number,
    pageSize: number,
    totalCount: number,
    items: CommentViewType[]
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

export type StatusType = {
    status: "Not Found" | "Forbidden" | "Updated" | "Deleted" | "Unauthorized" | "Too many requests" | "No content",
    code?: number,
    message?: string,
    data?: any,
}