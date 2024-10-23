const csvModel = require('../model/csvModel');
const csv=require('csvtojson');

class csvController{

    async create(req,res){
        try{
            const userData=[]

        csv()
        .fromFile(req.file.path)
       .then(async(response)=>{
        for( let i=0;i<response.length;i++){
            userData.push({
                name:response[i].name,
                email:response[i].email,
                mobile:response[i].mobile  
            })

        }
        const datas=await csvModel.insertMany(userData);
        res.status(200).json({
            message:"data saved successfully",
            data:datas
        })
       })

        }catch(err){
            res.status(400).json({
                message:"something went wrong"
            })  
        }

    }

    
    async alldata(req,res){
        try{
            const data=await csvModel.find();
            res.status(200).json({
                message:"data fetched successfully",
                total:data.length,
                data:data
            })
        }catch(err){
            res.status(400).json({
                message:"something went wrong"
            })
        }
    }   



}

module.exports = new csvController();