const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')
const mongoose = require('mongoose')
const config = require('./config')

mongoose.Promise = global.Promise
// Connect to Database
mongoose.connect(config.DATABASE_URL, {
  useMongoClient: true
})

// On Connection
mongoose.connection.on('connected', () => {
  console.log('Connected to database ' + config.DATABASE_URL)
})

// On Error
mongoose.connection.on('error', (err) => {
  console.log('Database error: ' + err)
})

const app = express()

// Port Number
const port = config.PORT || 8080

// CORS Middleware
app.use(cors())

// Body Parser Middleware
app.use(bodyParser.json())

// Module Import
require('./tasks')(app)

// Index Route
app.get('/', (req, res) => {
  res.send('Test endpoint!')
})

// Start Server
app.listen(port, () => {
  console.log('3...2...1... fire on port ' + port)
})
