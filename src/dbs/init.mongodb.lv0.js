//this file is non in use as this is lv0 which are not as professtional as the other

'use strict'

const mongoose = require('mongoose')

const connectString =  NODE_ENV
mongoose.connect( connectString).then( _ => console.log('Connected to MongoDB Success'))
.catch(err => console.error('Failed to connect to MongoDB'))

//dev
if (1 === 1){
  mongoose.set('debug', true)
  mongoose.set('debug', {color:true})
}

module.exports = mongoose