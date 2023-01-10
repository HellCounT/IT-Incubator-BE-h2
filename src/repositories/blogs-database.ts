import {blogsCollection} from "./db";
import {InsertOneResult, ObjectId} from "mongodb";
import {Blog} from "./types";

export const blogsRepo = {
    async createBlog(newBlog: Blog): Promise<InsertOneResult> {
        return await blogsCollection.insertOne({...newBlog})
    },
    async updateBlog(inputId: string, title: string, desc: string, website: string): Promise<boolean | null> {
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
    async deleteBlog(inputId: string): Promise<boolean | null> {
        if (ObjectId.isValid(inputId)) {
            const result = await blogsCollection.deleteOne({_id: new ObjectId(inputId)})
            return result.deletedCount === 1
        } else return null
    }
}