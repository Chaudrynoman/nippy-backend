const dotenv = require('dotenv')
dotenv.config()
const {  HTTP_Port, DATA_BASE_URL } = process.env
const config = {}
config.http_port = HTTP_Port
config.data_base_url = DATA_BASE_URL
module.exports = config
