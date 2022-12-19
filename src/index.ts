import express, {Request, Response} from "express"
import {blogsRouter} from "./routes/blogs-router";
import {postsRouter} from "./routes/posts-router";
import {deleteAllRouter} from "./routes/delete-all-router";

const app = express()
const port = process.env.PORT || 3000

app.use('/api/blogs', blogsRouter)
app.use('/api/posts', postsRouter)
app.use('/api/testing/all-data', deleteAllRouter)

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})