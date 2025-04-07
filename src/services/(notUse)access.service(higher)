/*
'use strict'
--------------------------------------------------------------------------------------------
WE DONT USE THIS ACCESS FILE BECAUSE THIS USING RSA HIGH TECHNIQUE WHICH IS HARDER TO USE
THIS TECHNIQUE USE FOR BIG COMPANY AND IMPORTANT PROJECT BUT 
FOR THIS E-COMMERCE PROJECT WE USE other file which is more simple and use for small company
--------------------------------------------------------------------------------------------


const shopModel = require("../models/shop.model");
const bcrypt = require('bcrypt');
const crypto = require('node:crypto');
const keyTokenService = require("./keyToken.service");
const {createTokenPair} = require("../auth/authUtils");
const { getInfoData } = require("../utils");

const RoleShop = {
  SHOP: 'SHOP',
  WRITER: '00001', //this code is use for writer role but we only show client the code for secure
  EDITOR: '00002',
  ADMIN: '00003',
}

class AccessService {
  static signUp = async ({ name , email , password }) => {
    try {
      //step 1 :check if email already exists ( use lean for java opject to reduce the size and time)
      const holderShop = await shopModel.findOne({ email }).lean();

      if (holderShop) {
        return {
          code: 'xxxx',
          message: 'Shop already regeistered'
        }
      }
      const passwordHash = await bcrypt.hash(password, 10);
      const newShop = await shopModel.create({
        name, email, password : passwordHash, roles: [RoleShop.SHOP]
      })

      if (newShop) {
        // create privateKey , publicKey : Private key use for client to sign the token, publicKey use for server to verify the token
        
        //RSA technique

        //this is complex advance technique and not recommended for beginner whihc not going for this e-commerce project
        const { privateKey, publicKey } = crypto.generateKeyPairSync('rsa', {
          modulusLength: 4086,
          publicKeyEncoding:{
            type: 'pkcs1',
            format: 'pem'
          },
          privateKeyEncoding:{
            type: 'pkcs1',
            format: 'pem'
          }
        })
        //Public key CryptoFraphy Standard 1
        

        console.log({ privateKey, publicKey }) //save collection KeyStore

        const publicKeyString = await keyTokenService.createKeyToken({
          userId: newShop._id,
          publicKey,
        })

        if (!publicKeyString) {
          return {
            code: 'xxxx',
            message: 'Shop already regeistered'
          }
        }

        console.log('publicKeyString : ' , publicKeyString  ) 

        const publicKeyObject = crypto.createPublicKey( publicKeyString )  

        console.log('publicKeyObject : ', publicKeyObject ) 

        // create token pair
        const tokens = await createTokenPair({
          userId: newShop._id,
          email
        }, publicKeyString, privateKey)

        console.log(`Create Token Success ::`, tokens) // save collection TokenPair

        return {
          code: 201,
          metadata: {
            shop: getInfoData({ fileds : ['_id' , 'name', 'email'], object : newShop }),
            tokens
          }
        }
      }
      return {
        code : 200,
        metadata: null
      }
    } catch (error) {
      return {
        code: 'xxx',
        message: error.message,
        status: 'error'
      }
    }
  }

}

module.exports = AccessService;

*/