const dotenv = require('dotenv')
dotenv.config()
const {  HTTP_Port, DATA_BASE_URL, X_API_KEY} = process.env
const config = {}
config.http_port = HTTP_Port
config.data_base_url = DATA_BASE_URL
config.x_api_key = X_API_KEY
module.exports = config
