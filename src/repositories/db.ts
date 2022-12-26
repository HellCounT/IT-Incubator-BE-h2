import {MongoClient} from "mongodb";

const mongoUri = process.env.mongoURI || "mongodb+srv://admin:D0ntP@yMyBi11s!@cluster0.3c7d4mo.mongodb.net/?retryWrites=true&w=majority"

export const client = new MongoClient(mongoUri)

export type Blog = {
    id: string,
    name: string,
    description: string,
    websiteUrl: string
    createdAt: string
}

export type Post = {
    id: string
    title: string,
    shortDescription: string,
    content: string,
    blogId: string
    blogName: string
    createdAt: string
}

export const postsCollection = client.db('blogs-platform').collection<Post>('posts')
export const blogsCollection = client.db('blogs-platform').collection<Blog>('blogs')

export async function runDb() {
    try {
        // Connect the client to server
        await client.connect()
        // Establish and verify connection
        await client.db("blogs-platform").command({ping: 1})
        console.log('Connected successfully to mongo server')
    } catch {
        console.log('Connection is not established')
        // Ensures that the client will close when you finish/error
        await client.close()
    }
}