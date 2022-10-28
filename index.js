const express = require('express')
require('dotenv').config()
const sequelize = require('./db')
const models = require('./models/models')
const cors = require('cors')

const port = process.env.PORT || 5000

const app = express()

app.use(cors())
app.use(express.json())

app.get('/', (req, res) => res.send('Users crud'))

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
