'use strict'

const DiscountService = require('../services/discount.service')

const { OK , CREATED , SuccessResponse} = require('../core/success.response')

class DiscountController {

  createDiscountCode = async(req, res ,next) => {
    new SuccessResponse({
      message: 'Create Discount Code Success!',
      metadata: await DiscountService.createDiscountCode({
        ...req.body,
        shopId: req.user.userId})
    }).send(res)
  }

  getAllDiscountCode = async(req, res,next) => {
    new SuccessResponse({
      message: 'Get All Discount Code Success!',
      metadata: await DiscountService.getAllDiscountCodeByShop({
        ...req.query,
        shopId: req.user.userId})
    }).send(res)
  }

  getDiscountAmount = async(req, res,next) => {
    new SuccessResponse({
      message: 'Get Discount Amount Success!',
      metadata: await DiscountService.getDiscountAmount({
        ...req.body,
      })
    }).send(res)
  }

  getAllDiscountCodeWithProduct = async(req, res,next) => {
    new SuccessResponse({
      message: 'Get All Discount Code With Product Success!',
      metadata: await DiscountService.getAllDiscountCodeWithProduct({
        ...req.query
      })
    }).send(res)
  }

}

module.exports = new DiscountController()