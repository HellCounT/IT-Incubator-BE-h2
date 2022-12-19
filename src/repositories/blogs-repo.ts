export type Blog = {
    id: string,
    name: string,
    description: string,
    websiteUrl: string
}

export const blogsDb: Array<Blog> = [
    {
        id: "id1",
        name: "Our Pets Blog",
        description: "Videos and posts about pets",
        websiteUrl: "https://blogsDB/1website1"
    },
    {
        id: "id2",
        name: "Rock Concerts",
        description: "Reports from Rock concerts and festivals",
        websiteUrl: "https://blogsDB/2website2"
    },
    {
        id: "id3",
        name: "Rave Music Digest",
        description: "Everything about underground electronic music in one place",
        websiteUrl: "https://blogsDB/3website3"
    }
]

export const blogsRepo = {
    viewAllBlogs() {
        return(blogsDb)
    },
    findBlogById(blogId: string) {
        const foundBlog = blogsDb.find(b => (b.id === blogId))
        return foundBlog
    },
    createBlog(title: string, desc: string, website: string) {
        const dateNow = new Date()
        const newBlog: Blog = {
            id: (+dateNow).toString(),
            name: title,
            description: desc,
            websiteUrl: website,
        }
        blogsDb.push(newBlog)
        return newBlog
    },
    updateBlog(title: string, desc: string, website: string) {

    }
}