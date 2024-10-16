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


    async edit(req,res){
        try{
            const {id} = req.params;
            const product = await ProductModel.findById(id);
            res.render('edit',{
                title:"edit page",
                product:product
            })
        }catch(err){
            res.send(err);
        }
    }

    async update(req,res){
        try{
            const {id} = req.params;
            const {name,price,size} = req.body;
            const product = await ProductModel.findByIdAndUpdate(id,{
                name,
                price,
                size
            })
            res.redirect('/');
        }catch(err){
            res.send(err);
        }
    }

    async delete(req,res){
        try{
            const {id} = req.params;
            const product = await ProductModel.findByIdAndDelete(id);
            res.redirect('/');
        }catch(err){
            res.send(err);
        }
    }

}

module.exports =new HomeController();