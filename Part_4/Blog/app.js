const express = require('express')
const mongoose = require('mongoose')
const config = require('./utils/config')
const logger = require('./utils/logger')
const middleware = require('./utils/middleware')
const blogsRouter = require('./controllers/blogs')


const app = express()

mongoose.connect(config.MONGODB_URL)

app.use(express.static('dist'))
app.use(express.json())

app.use('/api/blogs', blogsRouter)

app.use(express.json())

module.exports = app