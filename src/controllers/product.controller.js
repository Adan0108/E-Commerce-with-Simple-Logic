'use strict'
// const ProductService = require('../services/product.service')
const ProductServiceV2 = require('../services/product.service.xxx')

const { SuccessResponse } = require('../core/success.response')


class ProductController {
  createProduct = async (req, res, next) => {
    // new SuccessResponse({
    //   message: 'Create Product Created Success!',
    //   metadata: await ProductService.createProduct(req.body.product_type , {
    //     ...req.body,
    //     product_shop: req.user.userId
    //   })
    // }).send(res)
    new SuccessResponse({
      message: 'Create Product Created Success!',
      metadata: await ProductServiceV2.createProduct(req.body.product_type, {
        ...req.body,
        product_shop: req.user.userId
      })
    }).send(res)
  }

  //update Product
  updateProduct = async (req, res, next) => {
    // console.log('Updating product with ID:', req.params.productId);

    new SuccessResponse({
      message: 'Update Product Success!',
      metadata: await ProductServiceV2.updateProduct(req.body.product_type, req.params.productId, {
        ...req.body,
        product_shop: req.user.userId
      })
    }).send(res)
  }

  publishProductByShop = async (req, res, next) => {
    new SuccessResponse({
      message: 'publishProductByShop Success!',
      metadata: await ProductServiceV2.publishProductByShop({
        product_id: req.params.id,
        product_shop: req.user.userId
      })
    }).send(res)
  }

  unPublishProductByShop = async (req, res, next) => {
    new SuccessResponse({
      message: 'unPublishProductByShop Success!',
      metadata: await ProductServiceV2.unPublishProductByShop({
        product_id: req.params.id,
        product_shop: req.user.userId
      })
    }).send(res)
  }
  // QUERY //
  /**
   * @desc Get all Drafts for shop
   * @param {Number} limit
   * @param {Number} skip 
   * @return {JSON} 
   */
  getAllDraftsForShop = async (req, res, next) => {
    new SuccessResponse({
      message: 'Get List Draft Success!',
      metadata: await ProductServiceV2.findAllDraftsForShop({
        product_shop: req.user.userId
      })
    }).send(res)
  }

  getAllPublishForShop = async (req, res, next) => {
    new SuccessResponse({
      message: 'Get List Publish Success!',
      metadata: await ProductServiceV2.findAllPublishForShop({
        product_shop: req.user.userId
      })
    }).send(res)
  }
  getListSearchProduct = async (req, res, next) => {
    new SuccessResponse({
      message: 'Get getListSearchProduct Success!',
      metadata: await ProductServiceV2.searchProducts(req.params)
    }).send(res)
  }

  findAllProducts = async (req, res, next) => {
    new SuccessResponse({
      message: 'Get findAllProducts Success!',
      metadata: await ProductServiceV2.findAllProducts(req.query)
    }).send(res)
  }

  findProduct = async (req, res, next) => {
    new SuccessResponse({
      message: 'Get findOneProduct Success!',
      metadata: await ProductServiceV2.findProduct({
        product_id: req.params.product_id
      })
    }).send(res)
  }

  // END QUERY //
}

module.exports = new ProductController()