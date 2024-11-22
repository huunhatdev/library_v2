require('dotenv').config()
const express = require('express')
const cors = require('cors')
const router = require('./src/routes')
const { errorMiddleware } = require('./src/middlewares/error.middleware')
const server = express()
const mongoose = require('mongoose')

server.use(cors())
server.use(express.json())
server.use(express.urlencoded({ extended: true }))

mongoose
  .connect(process.env.MONGO_URI, {
    dbName: process.env.DB_NAME
  })
  .then(() => {
    console.log('Connected to MongoDB')
  })
  .catch((err) => {
    console.log('Error connecting to MongoDB', err)
  })

server.use('/api', router)
server.use(errorMiddleware)

server.listen(process.env.PORT, () => {
  console.log(`Server running on port ${process.env.PORT}`)
})
