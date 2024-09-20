


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





}

module.exports =new HomeController();