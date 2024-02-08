import express from 'express'
import dotenv from 'dotenv'
import cors from 'cors'
import cookieParser from 'cookie-parser'
import sequelize from './db.js'
import router from './routes/index.js'
import errorHandler from './middleware/ErrorHandlingMiddleware.js'
import fileUpload from 'express-fileupload'
import path from 'path'
import { dirname } from 'path'
import { fileURLToPath } from 'url'

dotenv.config()

const PORT = process.env.PORT || 7000

const app = express()

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

app.use(express.json())


const staticPath = path.resolve(__dirname, 'static')
app.use('/static', express.static(staticPath))

app.use(fileUpload({}))
app.use(cookieParser())
app.use(cors({
    credentials: true,
    origin: process.env.CLIENT_URL
}))
app.use('/api', router)


// Should be the last one
app.use(errorHandler)


const start = async () => {
    try {
        await sequelize.authenticate()
        await sequelize.sync()
        app.listen(PORT, () => console.log(`Server started on port ${PORT}`))
    } catch (e) {
        console.log(e)
    }
}

start()