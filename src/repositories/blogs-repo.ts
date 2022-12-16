export type Blog = {
    id: number,
    name: string,
    description: string,
    websiteUrl: string
}

export const blogsDb: Array<Blog> = [
    {
        id: 1,
        name: "Our Pets Blog",
        description: "Videos and posts about pets",
        websiteUrl: "https://blogsDB/1website1"
    },
    {
        id: 2,
        name: "Rock Concerts",
        description: "Reports from Rock concerts and festivals",
        websiteUrl: "https://blogsDB/2website2"
    },
    {
        id: 3,
        name: "Rave Music Digest",
        description: "Everything about underground electronic music in one place",
        websiteUrl: "https://blogsDB/3website3"
    }
]