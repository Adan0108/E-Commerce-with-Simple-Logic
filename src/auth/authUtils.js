'use strict'

const JWT = require('jsonwebtoken')
const asyncHandler = require('../helpers/asyncHandler')
const { AuthFailureError, NotFoundError} = require('../core/error.response')

//service
const { findByUserId } = require('../services/keyToken.service')

const HEADER = {
  API_KEY: 'x-api-key',
  CLIENT_ID : 'x-client-id',
  AUTHORIZATION: 'authorization',
  REFRESHTOKEN:'x-rtoken-id',
}
const createTokenPair = async ( payload , publicKey , privateKey ) => {
  try {
    //payload = infor to transer from system to another system through token
    //privateKey = private key for sign only happen one and not save to database, only use for client browser

    //accessToken
    const accessToken = await JWT.sign(payload, publicKey , {

      expiresIn: '2 days'
    })
    const refreshToken = await JWT.sign(payload, privateKey , {

      expiresIn: '7 days'
    })

    JWT.verify(accessToken, publicKey, (err, decoded) => {
      if (err) {
        console.error('error verify ::', err)
      } else {
        console.log('decoded ::', decoded)
      }
    })
    return { accessToken , refreshToken }

  } catch (error) {
    return error
  }
}

const authentication =  asyncHandler(async(req , res , next) => {
  /*
   1 - Check userId missing ?
   2 - get access token
   3 - verify Token
   4 - check user in dbs?
   5 - check keyStore with this userId
   6 - Ok all => return next()
   */

   const userId = req.headers[HEADER.CLIENT_ID]
   if(!userId) throw new AuthFailureError('Invalid Request')

    //2
    const keyStore = await findByUserId(userId)
    if(!keyStore) throw new NotFoundError(' Not Found Keystore')
    //3 
    const accessToken = req.headers[HEADER.AUTHORIZATION]
    if(!accessToken) throw new AuthFailureError('Invalid Request')

    try {
      const decodeUser = JWT.verify(accessToken , keyStore.publicKey)
      if(userId !== decodeUser.userId) throw new AuthFailureError('Invalid User')
      
      req.keyStore = keyStore
      return next()
    } catch (error) {
      throw error
    }
})

//V2 is a upgrade because we only use refreshToken when the access token is expired so no need to refresh when accessToken is still available
const authenticationV2 =  asyncHandler(async(req , res , next) => {
  /*
   1 - Check userId missing ?
   2 - get refresh token
   3 - verify Token
   4 - check user in dbs?
   5 - check keyStore with this userId
   6 - Ok all => return next()
   */

   const userId = req.headers[HEADER.CLIENT_ID]
   if(!userId) throw new AuthFailureError('Invalid Request')

    //2
    const keyStore = await findByUserId(userId)
    if(!keyStore) throw new NotFoundError(' Not Found Keystore')
    //3 
    if(req.headers[HEADER.REFRESHTOKEN]){
      try {
        const refreshToken = req.headers[HEADER.REFRESHTOKEN]
        const decodeUser = JWT.verify(refreshToken , keyStore.privateKey)
        if(userId !== decodeUser.userId) throw new AuthFailureError('Invalid User')
        req.keyStore = keyStore
        req.user = decodeUser
        req.refreshToken = refreshToken

        return next()
      } catch (error) {
        throw error
      }
    }

    const accessToken = req.headers[HEADER.AUTHORIZATION]
    if(!accessToken) throw new AuthFailureError('Invalid Request')

    try {
      const decodeUser = JWT.verify(accessToken , keyStore.publicKey)
      if(userId !== decodeUser.userId) throw new AuthFailureError('Invalid User')
      req.keyStore = keyStore
      req.user = decodeUser
      return next()
    } catch (error) {
      throw error
    }
})

const verifyJWT = async (token , keySecret) => {
  return await JWT.verify(token, keySecret)
}

module.exports = {
  createTokenPair,
  // authentication,
  verifyJWT,
  authenticationV2
}