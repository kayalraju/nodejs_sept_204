const ProductModel = require("../model/product");



class  HomeController {

    async home(req,res){
        try{4
            const product = await ProductModel.find();
           res.render('home',{
            title:"home page",
            products:product
           });
        }catch(err){
            res.send(err);
        }
    }
    async addProduct(req,res){
        try{
           res.render('addproduct',{
            title:"about page",
           });
        }catch(err){
            res.send(err);
        }
    }

    async creatre(req,res){
        //console.log(req.body);  
        
        try{
            const {name,price,size} = req.body;
            const product = new ProductModel({
                name,
                price,
                size
            })
            await product.save();
            res.redirect('/');
        }catch(err){
            res.send(err);
        }
    }




}

module.exports =new HomeController();