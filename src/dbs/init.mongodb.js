'use strict'
require('dotenv').config()
const mongoose = require('mongoose')
const {db : { host , port , name}} = require('../configs/config.mongodb')
const { countConnect } = require('../helpers/check.connect')

const connectString =  process.env.NODE_ENV || `mongodb://${host}:${port}/${name}`


class Database {
  constructor(){
    this.connect()
  }
  connect(type = 'mongodb'){

    //connect dev
    if (1 === 1){
      mongoose.set('debug', true)
      mongoose.set('debug', {color:true})
    }
    //connect
    mongoose.connect( connectString , {maxPoolSize:50}   //If maxPoolSize has not been reached, a new connection is created , If maxPoolSize is reached, the request waits until a connection is free.
    ).then( _ => console.log('Connected to MongoDB Success Pro'),countConnect())
    .catch(err => console.error('Failed to connect to MongoDB Pro'))
  }

  static getInstance(){
    if(!Database.instance){
      Database.instance = new Database()
    }
    return Database.instance
  }
}

const instanceMongodb = Database.getInstance()
module.exports = instanceMongodb