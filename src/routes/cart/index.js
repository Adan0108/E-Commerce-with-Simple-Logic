'use strict'

const express = require('express');
const CartController = require('../../controllers/cart.controller');
const router = express.Router();
const asyncHandler = require('../../helpers/asyncHandler');
const { authenticationV2 } = require('../../auth/authUtils');

router.post('' , asyncHandler(CartController.addToCart));
router.delete('' , asyncHandler(CartController.delete));
router.post('/update' , asyncHandler(CartController.update));
router.get('' , asyncHandler(CartController.listToCart));



module.exports = router