const { hashpassword, comparepassword } = require('../middleware/auth');
const userModel=require('../model/user');
const jwt=require('jsonwebtoken');

class UserController{
    async register(req,res){
        try{
           const {name,email,password,first_school}=req.body;
           if(!name || !email || !password || !first_school){
               return res.status(400).json({
                   message: 'Please fill all fields'
               })
           }
           //duplicate email check
           const userExist=await userModel.findOne({email});
           if(userExist){
               return res.status(400).json({
                   message: 'Email already exists'
               })
           }
           //create user
          const hashedPasswors=await hashpassword(password) 
          const user=await userModel({
               name,
               email,
               password:hashedPasswors,
               first_school
           })
           const datas=await user.save();    
           return res.status(200).json({
               message: 'User created successfully',
               data:datas
           })   
            
        }catch(err){
            return res.status(400).json({
                message: err.message
               
            })           
        }
    }


    async login(req,res){
        try{
            const {email,password}=req.body;
            if(!email || !password){
                return res.status(400).json({
                    message: 'invalid credentials'
                })
            }

            //check if user exists
            const user=await userModel.findOne({email});
            
            if(!user){
                return res.status(400).json({
                    message: 'Email id is not registered'
                })
            }
            //check if password is correct

           const match=await comparepassword(password,user.password);
           if(!match){
               return res.status(400).json({
                   message: 'invalid password'
               })
           }
           const token=jwt.sign({
               id:user._id,
               name:user.name,
               email:user.email,
               first_school:user.first_school
           },process.env.JWT_SECRET,{
               expiresIn:'30m'
           })
           return res.status(200).json({
               message: 'login successful',
               user:{
                name:user.name,
                email:user.email,
                first_school:user.first_school
               },
               token:token
           })

        }catch(err){
            return res.status(400).json({
                message: err.message
            })
        }

    }

    /**forget password */

    async forgetPsssword(req,res){
       try{
        const {email,first_school,newPassword}=req.body
        if(!email || !first_school || !newPassword){
            return res.status(400).json({
                message: 'Please fill all fields'
            })
        }
        const user=await userModel.findOne({email,first_school});  
        if(!user){
            return res.status(400).json({
                message: 'Email id is not registered'
            })
        }
        const hashed=await hashpassword(newPassword)
        await userModel.findByIdAndUpdate(user._id,{
            password:hashed
        });
        return res.status(200).json({
            message: 'Password updated successfully'
        })

       }catch(err){
           return res.status(400).json({
               message: err.message
           })
       }    
    }

/**update password */

async UpdatePasswordddd(req,res){
    try{
      //console.log(req.body);
      
        
        const user_id=req.body.user_id;
        const {password}=req.body; 
        
        const datauser=await userModel.findOne({_id:user_id});
        console.log('ss',datauser);
        
        if(datauser){
            const newPa=await hashpassword(password)
            await userModel.findByIdAndUpdate({_id:user_id},
                {
                    $set:{
                        password:newPa
                    }
                })
                return res.status(200).json({
                    message: 'Password updated successfully'
                })  
        }else{
            return res.status(400).json({
                message: 'User not found'
            })
        }
       


    }catch(err){
        return res.status(400).json({
            message: err.message
        })
    }
}

    async dashboard(req,res){
        return res.status(200).json({
           meaasge:"welcome to dashboard 👌👌👌👌👌"
        })
    }

}


module.exports=new UserController();