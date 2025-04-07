'use strict'

const { product , clothing , electronic, furniture } = require('../models/product.model')
const { BadRequestError } = require('../core/error.response')
const { findAllDraftsForShop,
   publishProductByShop, 
   unPublishProductByShop,
    findAllPublishForShop,
     searchProductByUser,
    findAllProducts,
    findProduct,
  updateProductById } = require('../models/repositories/product.repo')
const { removeUndefinedObject,updateNestedObjectParse } = require('../utils')
const { insertInventory } = require('../models/repositories/inventory.repo')

// define Factory class to create product
class ProductFactory {
  static productRegistry = {} //key class

  static registerProductType(type , classRef){
    ProductFactory.productRegistry[type] = classRef
  }

  static async createProduct( type , payload ){

    const productClass = ProductFactory.productRegistry[type]

    if (!productClass) throw new BadRequestError(`Invalid type ${type}`)
    return new productClass(payload).createProduct()
  }

  static async updateProduct( type , productId , payload  ){
    // console.log('Updating product(fact) with ID:', productId);
    const productClass = ProductFactory.productRegistry[type]
    if (!productClass) throw new BadRequestError(`Invalid type ${type}`)

    return new productClass(payload).updateProduct(productId)
  }

  // PUT //
  static async publishProductByShop({ product_shop , product_id }){
    return await publishProductByShop({ product_shop, product_id })
  }

  static async unPublishProductByShop({ product_shop , product_id }){
    return await unPublishProductByShop({ product_shop, product_id })
  }
  // END PUT //
  // query //
  static async findAllDraftsForShop( {product_shop, limit = 50, skip = 0} ){
    const query = { product_shop, isDraft: true}
    return await findAllDraftsForShop({query , limit , skip})
  }

  static async findAllPublishForShop( {product_shop, limit = 50, skip = 0} ){
    const query = { product_shop, isPublished: true}
    return await findAllPublishForShop({query , limit , skip})
  }

  static async searchProducts( {keySearch} ){
    return await searchProductByUser({keySearch})
  }
  
  static async findAllProducts( {limit = 50 , sort = 'ctime', page = 1 , filter = { isPublished : true}} ){
    return await findAllProducts({limit , sort , page, filter,
      select : ['product_name','product_price','product_thumb','product_shop']
    })
  }

  static async findProduct( {product_id } ){
    return await findProduct({product_id , unSelect: ['__v','product_variations']})
  }
  
}

//define base product class
class Product{
  constructor({product_name, product_thumb, product_description ,product_price , 
    product_quantity,product_type,product_shop,product_attributes}){
      this.product_name = product_name
      this.product_thumb = product_thumb
      this.product_description = product_description
      this.product_price = product_price
      this.product_quantity = product_quantity
      this.product_type = product_type
      this.product_shop = product_shop
      this.product_attributes = product_attributes
  }
  //create new product
  async createProduct(product_id){
    const newProduct = await product.create({...this, _id:product_id})
    if(newProduct){
      //add product_stock in inventory collection
      await insertInventory({
        productId: newProduct._id,
        shopId: this.product_shop,
        stock: this.product_quantity
      })
    }
      return newProduct
    }

  //update Product
  async updateProduct( productId , bodyUpdate ){
    // console.log('Updating product(super) with ID:', productId);
    return await updateProductById( {productId, bodyUpdate, model : product})
  }
}

//Define sub-class for different product types Clothing
class Clothing extends Product{
  async createProduct(){
    const newClothing = await clothing.create({
      ...this.product_attributes,
    product_shop: this.product_shop})
    if(!newClothing) throw new BadRequestError("create new Clothing Error")

    const newProduct = await super.createProduct(newClothing._id)
    if(!newProduct) throw new BadRequestError("create new Product Error")
      return newProduct
  }
  async updateProduct( productId ){
    // console.log('Updating product(child) with ID:', productId);
    //1. remove attr has null or undefined
    // console.log('[1]::', this)
     const objectParams = removeUndefinedObject(this)
    //  console.log('[2]::', this)
    //2. check xem updata o cho nao ?
    if(objectParams.product_attributes){
      //update child
      await updateProductById( 
        {productId, 
          objectParams : updateNestedObjectParse(objectParams.product_attributes),
          model : clothing})
    }
    const updateProduct = await super.updateProduct(productId, updateNestedObjectParse(objectParams))
    return updateProduct
  }
}

//Define sub-class for different product types Electronics
class Electronics extends Product{
  async createProduct(){
    const newElectronics = await electronic.create({
      ...this.product_attributes,
    product_shop: this.product_shop})
    if(!newElectronics) throw new BadRequestError("create new Electronics Error")

    const newProduct = await super.createProduct(newElectronics._id)
    if(!newProduct) throw new BadRequestError("create new Product Error")
      return newProduct
  }
  async updateProduct( productId ){
    // console.log('Updating product(child) with ID:', productId);
    //1. remove attr has null or undefined
    // console.log('[1]::', this)
     const objectParams = removeUndefinedObject(this)
    //  console.log('[2]::', this)
    //2. check xem updata o cho nao ?
    if(objectParams.product_attributes){
      //update child
      await updateProductById( 
        {productId, 
          objectParams : updateNestedObjectParse(objectParams.product_attributes),
          model : electronic})
    }
    const updateProduct = await super.updateProduct(productId, updateNestedObjectParse(objectParams))
    return updateProduct
  }
}

//Define sub-class for different product types newFuriture
class Furniture extends Product{
  async createProduct(){
    const newFuriture = await furniture.create({
      ...this.product_attributes,
    product_shop: this.product_shop})
    if(!newFuriture) throw new BadRequestError("create new newFuriture Error")

    const newProduct = await super.createProduct(newFuriture._id)
    if(!newProduct) throw new BadRequestError("create new Product Error")
      return newProduct
  }
  async updateProduct( productId ){
    // console.log('Updating product(child) with ID:', productId);
    //1. remove attr has null or undefined
    // console.log('[1]::', this)
     const objectParams = removeUndefinedObject(this)
    //  console.log('[2]::', this)
    //2. check xem updata o cho nao ?
    if(objectParams.product_attributes){
      //update child
      await updateProductById( 
        {productId, 
          objectParams : updateNestedObjectParse(objectParams.product_attributes),
          model : furniture})
    }
    const updateProduct = await super.updateProduct(productId, updateNestedObjectParse(objectParams))
    return updateProduct
  }
}

//register product types
ProductFactory.registerProductType('Electronics' , Electronics)
ProductFactory.registerProductType('Clothing' , Clothing)
ProductFactory.registerProductType('Furniture' , Furniture)

module.exports = ProductFactory;