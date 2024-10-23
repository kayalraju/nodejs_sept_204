
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
        default:"https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png"
    },
    slug:{
        type:String,
        lowercase:true
    }
  
});
productSchema.virtual('id').get(function(){
    return this._id.toHexString();
}); 
productSchema.set('toJSON',{
    virtuals:true
});

const ProductModel = mongoose.model('product',productSchema);

module.exports = ProductModel;