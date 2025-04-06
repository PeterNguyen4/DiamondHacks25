const mongoose = require('mongoose')

const productSchema = new mongoose.Schema({},{ strict: false }) 

const Product = mongoose.model('Product', productSchema);

module.exports = Product

