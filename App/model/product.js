
const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    price:{
        type:String,
        required:true
    },
    size:{
        type:String,
        required:true
    },
    image:{
        type:String,
    },
  
})

const ProductModel = mongoose.model('product',productSchema);

module.exports = ProductModel;