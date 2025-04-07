'use strict'

const InventoryService = require('../services/inventory.service')

const { OK , CREATED , SuccessResponse} = require('../core/success.response')

class InventoryController {

  addStock = async (req , res , next) => {
    new SuccessResponse({
      message : 'Add Stock to Inventory successfully',
      metadata : await InventoryService.addStockToInventory( req.body )
    }).send(res)
  }

}

module.exports = new InventoryController()