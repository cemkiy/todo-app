const env = require('dotenv')
const config = {}

// Environment Variables
env.config()

config.PORT = process.env.PORT
config.DATABASE_URL = process.env.DATABASE_URL

module.exports = config
