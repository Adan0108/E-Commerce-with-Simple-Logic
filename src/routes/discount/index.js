'use strict'

const express = require('express');
const DiscountController = require('../../controllers/discount.controller');
const router = express.Router();
const asyncHandler = require('../../helpers/asyncHandler');
const { authenticationV2 } = require('../../auth/authUtils');

//get amount a discount

router.post('/amount', asyncHandler(DiscountController.getDiscountAmount))
router.get('/list_product_code', asyncHandler(DiscountController.getAllDiscountCodeWithProduct))

//authentication//
router.use(authenticationV2)

router.post('', asyncHandler(DiscountController.createDiscountCode))
router.get('', asyncHandler(DiscountController.getAllDiscountCode))

module.exports = router