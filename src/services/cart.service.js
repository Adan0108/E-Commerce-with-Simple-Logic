'use strict'

const { BadRequestError,
  NotFoundError
} = require("../core/error.response")
const { convertToObjectIdMongodb } = require('../utils')
const { cart } = require("../models/cart.model")
const { getProductById } = require("../models/repositories/product.repo")

/*
Key features : Cart Service
1. Add product to cart [user]
2. reduce product quantity by one [User]
3. increae product quantity by one [User]
4. get cart [User]
5. delete cart [User]
6. delete cart items [User]
 */
class CartService {
  //// START REPO CART////
  static async updateUserCartQuantity({ userId, product }) {
    const { productId, quantity } = product
    const query = {
      cart_userId: userId,
      'cart_products.productId': productId,
      cart_state: 'active'
    },
      updateSet = {
        $inc: {
          'cart_products.$.quantity': quantity
        }
      }, options = { upsert: true, new: true }

    return await cart.findOneAndUpdate(query, updateSet, options)
  }

  static async createUserCart({ userId, product }) {
    const query = { cart_userId: userId, cart_state: 'active' },
      updateOrInsert = {
        $addToSet: {
          cart_products: product
        }
      }, options = { upsert: true, new: true }

    return await cart.findOneAndUpdate(query, updateOrInsert, options)
  }

  //// END REPO CART ////
  static async addToCart({ userId, product = {} }) {
    //check cart exist
    const userCart = await cart.findOne({ cart_userId: userId })
    if (!userCart) {
      //create cart for user
      return await CartService.createUserCart({ userId, product })
    }

    //neu co ro hang roi ma chua co san pham
    if (!userCart.cart_products.length) {
      userCart.cart_products = [product]
      return await userCart.save()
    }

    //gio hang ton rai va co san pham nay thi update quantity
    return await CartService.updateUserCartQuantity({ userId, product })
  }

  //update cart
  /*
  shop_order_ids :{
    shopId,
    item_products:{
      quantity,
      price,
      shopId,
      old_quantity,
      productId
      },
    version
  }
   */
  static async addToCartV2({ userId, shop_order_ids }) {
    const { productId, quantity, old_quantity } = shop_order_ids[0]?.item_products[0]
    console.log({ productId, quantity, old_quantity })
    // check product
    const foundProduct = await getProductById(productId)
    if (!foundProduct) {
      throw new NotFoundError("Product not found")
    }
    //compare
    if (foundProduct.product_shop.toString() !== shop_order_ids[0]?.shopId) {
      throw new NotFoundError(" Product do not belong to the shop")
    }
    if (quantity === 0) {
      //delete product
    }
    return await CartService.updateUserCartQuantity({
      userId,
      product: {
        productId,
        quantity: quantity - old_quantity,

      }
    })
  }

  //this is incomplete
  static async deleteUserCart({ userId , productId }){
    const query = { cart_userId: userId, cart_state: 'active'}
    const updateSet = {
      $pull : {
        cart_products : {
          productId
        }
      }
    }
    const deleteCart = await cart.updateOne( query , updateSet)
    return deleteCart
  }
  // Delete a specific product from the cart (cart item)
  // static async deleteUserCartItem({ userId, productId }) {
  //   const query = { cart_userId: userId, cart_state: 'active' };
  //   const updateSet = {
  //     $pull: {
  //       cart_products: { productId } // remove any element with matching productId
  //     }
  //   };

  //   const result = await cart.updateOne(query, updateSet);
  //   // Optionally check result.nModified (or result.modifiedCount)
  //   return result;
  // }

  // // Optionally, a function to delete/clear the entire cart
  // static async deleteUserCart({ userId }) {
  //   return await cart.deleteOne({ cart_userId: userId, cart_state: 'active' });
  // }

  static async getListUserCart({ userId }){
    return await cart.findOne({
      cart_userId : +userId
    }).lean()
  }

}

module.exports = CartService