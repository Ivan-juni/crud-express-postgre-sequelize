import express, { Request, Response } from 'express'
import dotenv from 'dotenv'
import sequelizeConnection from './db'
import cors from 'cors'
import cookieParser from 'cookie-parser'
import logger from './logger'
import expressWinston from 'express-winston'
import errorHandler from './middleware/ErrorHandlingMiddleware'
import router from './routes/index'

dotenv.config()

const port = process.env.PORT || 5000

const app = express()

app.use(cors())
app.use(express.json())
app.use(cookieParser())
app.use(expressWinston.logger(logger))
app.use(express.urlencoded({ extended: false }))

// main router
app.use('/api', router)

// Обработка ошибок, последний middleware
app.use(errorHandler)

app.get('/', (req: Request, res: Response) =>
  res.status(200).json({ message: 'Server is working' })
)

const start = async () => {
  try {
    await sequelizeConnection.authenticate()
    await sequelizeConnection.sync()
    app.listen(port, () => console.log(`App listening on port ${port}`))
  } catch (error) {
    console.log(error)
  }
}

start()
