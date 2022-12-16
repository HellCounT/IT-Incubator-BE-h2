export type Post = {
    id: string
    title: string,
    shortDescription: string,
    content: string,
    blogId: number
    blogName: string
}

export const postsDb: Array<Post> = [
    {
        id: "1",
        title: "Funny Cats",
        shortDescription: "Some text about cats",
        content: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Vitae auctor eu augue ut lectus arcu.",
        blogId: 1,
        blogName: "Our Pets Blog"
    },
    {
        id: "2",
        title: "Rock Am Ring 2001",
        shortDescription: "How it was at RaR2001",
        content: "Urna et pharetra pharetra massa massa ultricies. Arcu odio ut sem nulla pharetra diam sit. Eros donec ac odio tempor orci. Est ante in nibh mauris cursus mattis molestie a iaculis.",
        blogId: 2,
        blogName: "Rock Concerts"
    },
    {
        id: "3",
        title: "Qlimax 2022",
        shortDescription: "My report from Q2022",
        content: "Luctus accumsan tortor posuere ac ut consequat semper. Mi tempus imperdiet nulla malesuada. Pretium quam vulputate dignissim suspendisse in est ante in nibh.",
        blogId: 3,
        blogName: "Rave Music Digest"
    }
]

