const express = require ('express');
const cors = require('cors')
const bodyParser = require('body-parser')
const myModel = require('./routes/myModel');
const admin = require('./routes/admin');
const user = require('./routes/user');
const config = require('./config/config');
require('./dbCon')

const app = express()
const corsOptions = {
    origin: '*',
    optionsSuccessStatus: 200
  }
app.use(cors(corsOptions))
app.use(bodyParser.json({ limit: '10mb' }));
app.use(bodyParser.urlencoded({ extended: true, limit: '10mb' }));
app.use(express.json());
app.use(myModel);
app.use(admin);
app.use(user);

try{
    
    app.listen(config.http_port, 'localhost', () => {
        console.log(`Running on port ${config.http_port}`, )
      })

}catch(e){
    console.log("error",e)
}