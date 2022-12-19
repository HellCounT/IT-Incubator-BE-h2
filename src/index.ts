import express, {Request, Response} from "express"
import {blogsRouter} from "./routes/blogs-router";
import {postsRouter} from "./routes/posts-router";

const app = express()
const port = process.env.PORT || 3000

app.use('/api/blogs', blogsRouter)
app.use('/api/posts', postsRouter)

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})