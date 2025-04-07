/*

------------------------------------------------------------------------------------------------
THIS ALSO NOT IN USE AS IT SERVER THE OTHER ACCESS.SERVICE FILES WHICH USE HIGH LEVEL TECHNIQUES
------------------------------------------------------------------------------------------------
'use strict'

const keyTokenModel = require('../models/keyToken.model');

class keyTokenService {
  static createKeyToken = async ({userId , publicKey}) => {
    try {
      const publicKeyString = publicKey.toString()
      const tokens = await keyTokenModel.create({
        user: userId,
        publicKey: publicKeyString
      })
      return tokens ? tokens.publicKey : null
    } catch (error) {
      return error
    }
  }

}

module.exports = keyTokenService;
*/