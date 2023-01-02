import {blogsCollection, Blog} from "./db";
import {InsertOneResult, ObjectId} from "mongodb";

export const blogsRepo = {
    async createBlog(newBlog: Blog): Promise<InsertOneResult> {
        return await blogsCollection.insertOne({...newBlog})
    },
    async updateBlog(inputId: string, title: string, desc: string, website: string) {
        if (ObjectId.isValid(inputId)) {
            const result = await blogsCollection.updateOne(
                {_id: new ObjectId(inputId)},
                {$set: {
                        name: title,
                        description: desc,
                        websiteUrl: website
                    }})
            return result.matchedCount === 1
        } else return null
    },
    async deleteBlog(inputId: string) {
        if (ObjectId.isValid(inputId)) {
            const result = await blogsCollection.deleteOne({_id: new ObjectId(inputId)})
            return result.deletedCount === 1
        } else return null
    }
}