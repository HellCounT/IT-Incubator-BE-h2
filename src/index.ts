import express from "express"
import {blogsRouter} from "./routes/blogs-router";
import {postsRouter} from "./routes/posts-router";
import {deleteAllRouter} from "./routes/delete-all-router";
import {runDb} from "./repositories/db";
import {usersRouter} from "./routes/users-router";
import {loginRouter} from "./routes/login-router";

const app = express()
const port = process.env.PORT || 3000

app.use(express.json())

app.use('/blogs', blogsRouter)
app.use('/posts', postsRouter)
app.use('/testing', deleteAllRouter)
app.use('/users', usersRouter)
app.use('/auth', loginRouter)

const startApp = async () => {
    await runDb()
    app.listen(port, () => {
        console.log(`Example app listening on port ${port}`)
    })
}


startApp()


