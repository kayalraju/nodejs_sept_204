
const Product = require('../model/product'); 

class ProductController {
    async craetreProduct(req,res){
      //console.log(req.body);
      try{
        const {name,price,size} = req.body;

        const data=new Product({
            name,
            price,
            size
        })
        const savedata = await data.save();
        return res.status(201).json({
            message:"data saved successfully",
            savedata
        })

      }catch(err){
        console.log(err);
      }
      
    }

    async getAllProduct(req,res){
      try{
        const data = await Product.find();

        return res.status(200).json({
          message:"data fetched successfully",
          total:data.length,
          data
        })
      }catch(err){
        console.log(err);
      }
    }


}


module.exports =new ProductController();