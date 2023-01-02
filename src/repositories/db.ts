import {MongoClient, ObjectId} from "mongodb";
import dotenv from "dotenv"
dotenv.config()

const mongoUri = process.env.MONGO_URL

if (!mongoUri) {
    throw new Error('MONGO URL IS NOT FOUND')
}

console.log(mongoUri)
export const client = new MongoClient(mongoUri)

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

export type BlogViewType = {
    id: string,
    name: string,
    description: string,
    websiteUrl: string,
    createdAt: string
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

export type PostViewType = {
    id: string,
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

export const postsCollection = client.db().collection<Post>('posts')
export const blogsCollection = client.db().collection<Blog>('blogs')

export const runDb = async() => {
    try {
        // Connect the client to server
        await client.connect()
        // Establish and verify connection
        await client.db().command({ping: 1})
        console.log('Connected successfully to mongo server')
    } catch (e) {
        console.log(e)
        // Ensures that the client will close when you finish/error
        await client.close()
    }
}
