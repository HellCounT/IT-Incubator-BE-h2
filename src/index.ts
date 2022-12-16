import express, {Request, Response} from "express"
import {Blog, blogsDb} from "./repositories/blogs-repo"
import {postsDb} from "./repositories/posts-repo"

const app = express()
const port = process.env.PORT || 3000

app.use(express.json())

type FieldError = {
    message: string,
    field: string
}
type APIErrorResult = Array<FieldError>

app.get('/api/blogs', (req: Request, res: Response) => {
    res.send(blogsDb).status(200);
})

app.post('/api/blogs', (req: Request, res: Response) => {
    // Blog adding
    const dateNow = new Date()
    const addBlog: Blog = {
        id: +dateNow,
        name: req.body.name,
        description: req.body.description,
        websiteUrl: req.body.websiteUrl,
    }
    blogsDb.push(addBlog)

    return res.status(201).send(addBlog)
})

app.get('/api/blogs/:id', (req: Request, res: Response) => {
    const blogId: number = +req.params.id
    const foundBlog = blogsDb.find(b => (b.id === blogId))
    if (foundBlog) {
        res.status(200).send(foundBlog)
    } else {
        res.sendStatus(404)
    }
})

app.put('/api/blogs/:id', (req: Request, res: Response) => {

})

app.delete('/api/blogs/:id', (req: Request, res: Response) => {

})


app.get('/api/posts', (req: Request, res: Response) => {
    res.send(postsDb).status(200)
})

app.post('/api/posts', (req: Request, res: Response) => {

})

app.get('/api/posts/:id', (req: Request, res: Response) => {
    const postId: string = req.params.id
    const foundPost = postsDb.find(p => (p.id === postId))
    if (foundPost) {
        res.status(200).send(foundPost)
    } else {
        res.sendStatus(404)
    }
})

app.put('/api/posts/:id', (req: Request, res: Response) => {

})

app.delete('/api/posts/:id', (req: Request, res: Response) => {

})



app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})