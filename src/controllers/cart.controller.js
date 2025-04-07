'use strict'

const CartService = require('../services/cart.service')

const { OK , CREATED , SuccessResponse} = require('../core/success.response')

class CartController {
  /**
   * @desc : add to cart for user
   * @param {int} userId
   * @param {*} res
   * @param {*} next
   * @method POST
   * @url /v1/api/cart/user
   * @return {
   * }
   */
  addToCart = async (req , res , next) => {
    new SuccessResponse({
      message : 'create new cart successfully',
      metadata : await CartService.addToCart( req.body )
    }).send(res)
  }

  update = async (req , res , next) => {
    new SuccessResponse({
      message : 'update cart successfully',
      metadata : await CartService.addToCartV2( req.body )
    }).send(res)
  }

  delete = async (req , res , next) => {
    new SuccessResponse({
      message : 'delete new cart successfully',
      metadata : await CartService.deleteUserCart( req.body )
    }).send(res)
  }

  listToCart = async (req , res , next) => {
    new SuccessResponse({
      message : 'get list cart successfully',
      metadata : await CartService.getListUserCart( req.query )
    }).send(res)
  }

}

module.exports = new CartController()