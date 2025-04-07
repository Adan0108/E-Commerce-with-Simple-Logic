'use strict'

const { BadRequestError,
  NotFoundError
} = require("../core/error.response")
const { convertToObjectIdMongodb } = require('../utils')

const { findCartById } = require("../models/repositories/cart.repo");
const { checkProductByServer } = require("../models/repositories/product.repo");
const { getDiscountAmount } = require("./discount.service");

class CheckoutService {
  //login and without login
  /*
  {
    cartId,
    userId,
    shop_order_ids : [{
      shopId,
      shop_discount : [
      {              
        "shop_id"
        "discountId"
        "codeId"
      }]
      item_products :[
      {
        price,
        quantity,
        productId
      }
      ]
    }]
  }
   
   */
  static async checkoutReview({ cartId, userId, shop_order_ids }) {
    //check if cartId exist
    const foundCart = await findCartById(cartId);
    if (!foundCart) throw new BadRequestError(`Cart ${cartId} not found`)

    const checkout_order = {
      totalPrice: 0, //tong tien hang
      feeShip: 0,
      totalDiscount: 0,
      totalCheckout: 0 // tong thanah toan
    }, shop_order_ids_new = []

    //tinh tong tien bill
    for (let i = 0; i < shop_order_ids.length; i++) {
      const { shopId, shop_discounts = [], item_products = [] } = shop_order_ids[i]
      //check if product available
      const checkProductServer = await checkProductByServer(item_products)
      console.log(" check Product Server::", checkProductServer)
      if (!checkProductServer[0]) throw new BadRequestError('order wrong !!!')
      //tong tien don hang
      const checkoutPrice = checkProductServer.reduce((acc, product) => {
        return acc + (product.quantity * product.price)
      }, 0)

      //tong tien truoc khi su ly
      checkout_order.totalPrice += checkoutPrice

      const itemCheckout = {
        shopId,
        shop_discounts,
        priceRaw: checkoutPrice, //tien truoc khi giam gia
        priceApplyDiscount: checkoutPrice,
        item_products: checkProductServer
      }
      console.log(`number of discount: ${shop_discounts.length}`)

      //neu shop_discount ton tai > 0 , thi chheck xem co hop le khong
      if (shop_discounts.length > 0) {
        //gia su chi co mot discount
        //get amount discount
        const { totalPrice = 0, discount = 0 } = await getDiscountAmount({
          codeId: shop_discounts[0].codeId,
          userId,
          shopId,
          products: checkProductServer
        })
        //tong cong discount giam gia
        checkout_order.totalDiscount += discount
        console.log(`total dicount: ${checkout_order.totalDiscount}`)

        //neu tien giam gia luon hon khong
        if (discount > 0) {
          itemCheckout.priceApplyDiscount = checkoutPrice - discount
          console.log(`${checkoutPrice} - ${discount} = ${itemCheckout.priceApplyDiscount}`)
        }
      }
      //tong thanh toan cuoi cung
      checkout_order.totalCheckout += itemCheckout.priceApplyDiscount
      shop_order_ids_new.push(itemCheckout)
    }
    return {
      shop_order_ids,
      shop_order_ids_new,
      checkout_order
    }
  }
  //tinh tong tien bill

  //order
  static async orderByUser({
    shop_order_ids,
    cartId,
    userId,
    user_address = {},
    user_payment = {}
  }){
    const { shop_order_ids_new , checkout_order } = await CheckoutService.checkoutReview({
      cartId,
      userId,
      shop_order_ids: shop_order_ids
    })

    //check lai  1 lan nua xem vuot ton kho hay ko ?
    //get new array Product
    const products = shop_order_ids_new.flatMap( order => order.item_products )
    console.log(`[1]::`, products)
    for ( let i = 0 ; i < products.length(); i++){
      const { productId , quantity } = products[i];
    }
  }

}

module.exports = CheckoutService