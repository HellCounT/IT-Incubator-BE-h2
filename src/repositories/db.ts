import {MongoClient} from "mongodb";
import dotenv from "dotenv"
import {Blog, CommentInsertDbType, Post, UserInsertDbType} from "./types";
import {settings} from "../settings";
dotenv.config()

const mongoUri = settings.MONGO_URI

if (!mongoUri) {
    throw new Error('MONGO URL IS NOT FOUND')
}

console.log(mongoUri)
export const client = new MongoClient(mongoUri)

export const postsCollection = client.db().collection<Post>('posts')
export const blogsCollection = client.db().collection<Blog>('blogs')
export const usersCollection = client.db().collection<UserInsertDbType>('users')
export const commentsCollection = client.db().collection<CommentInsertDbType>('comments')

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
