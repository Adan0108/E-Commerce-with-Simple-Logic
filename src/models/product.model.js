'use strict';

const {model , Schema , Types } = require('mongoose')

const slugify = require('slugify');

const DOCUMENT_NAME = 'Product';
const COLLECTION_NAME = 'Products';

const productSchema = new Schema({
  product_name : {  //quan jean cao cap
    type: String,
    required: true,
  },
  product_thumb : {
    type: String,
    required: true,
  },
  product_description : String,
  product_slug : String, // quan-jean-cao-cap
  product_price : {
    type: Number,
    required: true,
  },
  product_quantity : {
    type: Number,
    required: true
  },
  product_type:{
    type: String,
    required: true,
    enum : ['Electronics', 'Clothing', 'Furniture']
  },

  product_shop: { type: Schema.Types.ObjectId , ref: 'Shop'},

  product_attributes:{
    type: Schema.Types.Mixed,
    required: true
  },
  //more
  product_ratingAverage: {
    type: Number,
    default: 4.5,
    min:[1,"Rating must above 1.0"],
    max:[5,"Rating must below 5.0"],
    set: (val) => Math.round(val * 10) / 10
  },
  product_variations: {
    type: Array,
    default: []
  },
  isDraft: {
    type: Boolean,
    default: true,
    index: true,
    select: false
  },
  isPublished: {
    type: Boolean,
    default: false,
    index: true,
    select: true
  }
},{
  timestamps: true,
  collection: COLLECTION_NAME
})
//create index for search
productSchema.index({ product_name: 'text' , product_description: 'text'})
//Document middleware: run before .save() and .create()...
productSchema.pre('save', function(next){
  this.product_slug = slugify(this.product_name , { lower : true })
  next()
})

//define product type = clothing

const clothingSchema = new Schema({
  brand : { 
    type: String,
    required: true
  },
  size : String,
  material : String,
  product_shop: { type: Schema.Types.ObjectId, ref: 'Shop' }
}, {
  collection: 'clothes',
  timestamps: true
})

//define product type = electronic

const electronicSchema = new Schema({
  manufacturer : { 
    type: String,
    required: true
  },
  model : String,
  color : String,
  product_shop: { type: Schema.Types.ObjectId, ref: 'Shop' }  // reference to the shop schema for product owner/seller association 
}, {
  collection: 'electronics',
  timestamps: true
})

//define product type = furnitures

const furnitureSchema = new Schema({
  brand : { 
    type: String,
    required: true
  },
  size : String,
  material : String,
  product_shop: { type: Schema.Types.ObjectId, ref: 'Shop' }
}, {
  collection: 'furnitures',
  timestamps: true
})

module.exports = {
  product: model(DOCUMENT_NAME,productSchema),
  electronic: model('Electronics',electronicSchema),
  clothing: model('Clothing',clothingSchema),
  furniture: model('Furniture',furnitureSchema)
};