import {PostDbType, PostViewType} from "../repositories/db";
import {PostCreateType} from "../repositories/db";
import {postsRepo} from "../repositories/posts-database";

const mapPostToViewType = (post: PostDbType): PostViewType => {
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

export const postsService = {
    async viewAllPosts(): Promise<PostViewType[]> {
        const allPosts = await postsRepo.viewAllPosts()
        return allPosts.map(p => mapPostToViewType(p))
    },
    async findPostById(id: string): Promise<PostViewType| null> {
        const foundPost = await postsRepo.findPostById(id)
        if (foundPost) {
            return mapPostToViewType(foundPost)
        } else return null
    },
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