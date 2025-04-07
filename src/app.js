
require('dotenv').config(); //load environment variables
const express = require('express');
const {default : helmet} = require('helmet'); //for security header (use to hide the tech use to run server)
const morgan = require('morgan'); //for response log
const app = express();
const compression = require('compression'); //for compressing response


//init middlewares
app.use(morgan("dev"));
app.use(helmet())
app.use(compression());
app.use(express.json()); // for parsing json request
app.use(express.urlencoded({
  extended:true  // support parsing of application/x-www-form-urlencoded
}))

//init db
require('./dbs/init.mongodb');
// const { checkOverload } = require(`./helpers/check.connect`)
// checkOverload();

// init routes
// app.get('/', (req, res, next) => {

//   // const strCompress = 'Hello world'

//   return res.status(200).json({ 
//     message: 'Welcome to the API!' ,
//     // metadata : strCompress.repeat(1000),
//   });
// })

app.use('/',require('./routes'))
 
//handle error
app.use((req, res, next) => {
  const error = new Error('Not Found')
  error.status = 404;
  next(error)
})


app.use((error, req, res, next) => {
  const statusCode = error.status || 500;
  return res.status(statusCode).json({
    status: 'error',
    code: statusCode,
    message: error.message || 'Internal Server Error'
  })
})

module.exports = app;