'use strict'

const StatusCode = {
  OK: 200,
  CREATED : 201
}

const ReasonStatusCode = {
  CREATED: 'Created !',
  OK : 'Success'
}
class SuccessResponse {
  constructor({message, reasonStatusCode = ReasonStatusCode.OK, statusCode = StatusCode.OK , metadata = {}}) {
    this.message = !message ? reasonStatusCode : message
    this.status = statusCode
    this.metadata = metadata
  }

  send(res,header = {}){
    return res.status(this.status).json(this)
  }
}

class OK extends SuccessResponse {
  constructor(message, metadata){
    super({message, metadata})
  }
}

class CREATED extends SuccessResponse {
  constructor({message, reasonStatusCode = ReasonStatusCode.OK, statusCode = StatusCode.OK , metadata = {},options = {}}){
    super({message, reasonStatusCode, statusCode, metadata})
    this.options = options
  }
}

module.exports = {
  OK ,
  CREATED,
  SuccessResponse
}