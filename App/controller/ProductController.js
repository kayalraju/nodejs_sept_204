
const Product = require('../model/product'); 
const fs = require('fs');
const path = require('path');
const { Validator } = require('node-input-validator');
class ProductController {
    async craetreProduct(req,res){
      //console.log(req.body);
      try{
        const v=new Validator(req.body,{
            name:'required|minLength:3|maxLength:20',
            price:'required',
            size:'required'
        });
        const matched=await v.check().then((val)=>val);
        if(!matched){
            return res.status(400).json({
                message:v.errors
            })
        }
        const {name,price,size} = req.body;
        const file=req.file;
        if(!file){
            return res.status(400).json({
                message:"image is required"
            })
        }
        const fileName=file.filename;
        const basePath=`${req.protocol}://${req.get('host')}/uploads/`;

        const data=new Product({
            name,
            price,
            size,
            image:`${basePath}${fileName}`
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

    async getProductById(req,res){
      try{
        const id = req.params.id;
        const data = await Product.findById(id);
        return res.status(200).json({
          message:"get single data",
          data
        })
      }catch(err){
        console.log(err);
      }
    }

    async updateProduct(req,res){
      try{
        
        const id = req.params.id;
        const {name,price,size} = req.body;
        const data = await Product.findByIdAndUpdate(id,{
          name,
          price,
          size
        })
        return res.status(200).json({
          status:200,
          message:"data updated successfully",
        })
      }catch(err){
        console.log(err);
      }
    }

    async deleteProduct(req,res){
      try{
        const id = req.params.id;
        const dlee = await Product.findByIdAndDelete(id);
        //console.log('kk',dlee.image);
        const filePath = path.join(__dirname, 'uploads');
        console.log('aaa',filePath);
        
           fs.unlinkSync(filePath.dlee.image);
          return res.status(200).json({
            status:200,
            message:"data deleted successfully",
          })
         
       
      }catch(err){
        console.log(err);
      }
    }
}


module.exports =new ProductController();