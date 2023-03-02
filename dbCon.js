const mongoose = require('mongoose')
const config = require('./config/config')
const dbURI = config.data_base_url || 'mongodb://localhost/simpledb'
mongoose.set("strictQuery", false);

const connectWithRetry = () => {
  return mongoose.connect(dbURI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  })
}

connectWithRetry()
  .then(() => {
    console.log('info', 'Mongoose connection:', 'Connection Established')
  })
  .catch((e) => {
    console.log('error', 'Mongoose connection Issue:', e)
  })

// Connectivity status on connection resetting
mongoose.connection.on('reconnected', () =>
  console.log('info', 'Mongoose connection:', 'Connection Reestablished')
)

// Connectivity status on disconnection
mongoose.connection.on('disconnected', () => {
  console.log('info', 'Mongoose connection:', 'Connection Disconnected')
  setTimeout(connectWithRetry, 5000)
})

// Connectivity Status  On connection close
mongoose.connection.on('close', () =>
  console.log('info', 'Mongoose connection Issue:', 'Connection Closed')
)

// Connectivity Status  On error
mongoose.connection.on('error', (error) =>
  console.log('error', 'Mongoose connection Issue:', error)
)

module.exports = mongoose
