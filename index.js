const express = require('express')
require('dotenv').config()
const sequelize = require('./db')
const cors = require('cors')
const cookieParser = require('cookie-parser')
const models = require('./models/models')
const errorHandler = require('./middleware/ErrorHandlingMiddleware')
const router = require('./routes/index')

const port = process.env.PORT || 5000

const app = express()

app.use(cors())
app.use(express.json())
app.use(cookieParser())
app.use(express.urlencoded({ extended: false }))

// main router
app.use('/api', router)

// Обработка ошибок, последний middleware
app.use(errorHandler)

app.get('/', (req, res) =>
  res.status(200).json({ message: 'Server is working' })
)

const start = async () => {
  try {
    await sequelize.authenticate()
    await sequelize.sync()
    app.listen(port, () => console.log(`App listening on port ${port}`))
  } catch (error) {
    console.log(error)
  }
}

start()
