import express from "express"
import {blogsRouter} from "./routes/blogs-router";
import {postsRouter} from "./routes/posts-router";
import {deleteAllRouter} from "./routes/delete-all-router";
import {runDb} from "./repositories/db";

const app = express()
const port = process.env.PORT || 3000

app.use(express.json())

app.use('/blogs', blogsRouter)
app.use('/posts', postsRouter)
app.use('/testing', deleteAllRouter)

const startApp = async () => {
    await runDb()
    app.listen(port, () => {
        console.log(`Example app listening on port ${port}`)
    })
}


startApp()


