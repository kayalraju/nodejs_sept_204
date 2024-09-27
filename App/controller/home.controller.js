


class  HomeController {

    async home(req,res){
        try{
           res.render('home',{
            title:"home page",
           });
        }catch(err){
            res.send(err);
        }
    }
    async about(req,res){
        try{
           res.render('about',{
            title:"about page",
           });
        }catch(err){
            res.send(err);
        }
    }





}

module.exports =new HomeController();