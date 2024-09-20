


class  HomeController {

    async home(req,res){
        try{
           res.render('home');
        }catch(err){
            res.send(err);
        }
    }





}

module.exports =new HomeController();