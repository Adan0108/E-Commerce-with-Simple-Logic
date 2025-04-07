'use strict'

const { model , Schema , Types } = require('mongoose')

const DOCUMENT_NAME = 'Order'
const COLLECTION_NAME = 'Orders'

const orderSchema = new Schema({
  order_userId : { 
    type : Number,
    required: true
  },
  order_checkout : {
    type: Object,
    default: {}
  },
  /*
    order_checkout = {
      totalPrice : ,
      totalApplyDiscount: ,
      feeShip :
    }
   */
  order_shipping: {
    type: Object,
    default: {}
  },
  /*
    order_shipping = {
      street : ,
      city : ,
      state : ,
      country : ,
    }
   */
  order_payment: {
    type: Object,
    default: {}
  },
  order_products: {
    type: Array,
    required: true,
  },
  order_trackingNumber:{
    type: String,
    default: '0000118042025'
  },
  order_status: {
    type: String,
    enum: ['pending', 'confirmed','shipped','cancelled','delivered'],
    default: 'pending'
  }

}, {
  timestamps: {
    createdAt: 'createdOn',
    updatedAt: 'modifiedOn'
  },
  collection: COLLECTION_NAME
})

module.exports = {
  order: model(DOCUMENT_NAME , orderSchema)
}