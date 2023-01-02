import {PostCreateType} from "../repositories/db";
import {postsRepo} from "../repositories/posts-database";
import {PostViewType} from "../repositories/queryRepo";

export const postsService = {
    async createPost(postTitle: string, short: string, text: string, blogId: string): Promise<PostViewType | null> {
        const newPost: PostCreateType = {
            title: postTitle,
            shortDescription: short,
            content: text,
            blogId: blogId,
            createdAt: new Date().toISOString()
        }
            return await postsRepo.createPost(newPost)
    },
    async updatePost(inputId: string, postTitle: string, short: string, text: string, blogId: string): Promise <boolean | null> {
        return await postsRepo.updatePost(inputId, postTitle, short, text, blogId)
    },
    async deletePost(inputId: string): Promise <boolean | null> {
        return await postsRepo.deletePost(inputId)
    }
}