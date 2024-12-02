const sendEmailVerificationOTP = require('../helper/EmailVeryfy');
const { hashpassword, comparepassword } = require('../middleware/auth');
const userModel=require('../model/user');
const EmailVerifyModel=require('../model/otpVeryfy')
const jwt=require('jsonwebtoken');
const transporter = require('../config/EmailConfig');
const bcrypt=require('bcryptjs')
class UserController{
    /**reqgister api */
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
           /**email send otp */ 
           sendEmailVerificationOTP(req,user)   
           return res.status(200).json({
               message: 'User created successfully and send otp to email please verify',
               data:datas
           })   
            
        }catch(err){
            return res.status(400).json({
                message: err.message
               
            })           
        }
    }
/**verify email */


async verifyEmail(req,res){
    try {
        const { email, otp } = req.body;
        // Check if all required fields are provided
        if (!email || !otp) {
            return res.status(400).json({ status: false, message: "All fields are required" });
        }
        const existingUser = await userModel.findOne({ email });

        // Check if email doesn't exists
        if (!existingUser) {
            return res.status(404).json({ status: "failed", message: "Email doesn't exists" });
        }

        // Check if email is already verified
        if (existingUser.is_verified) {
            return res.status(400).json({ status: false, message: "Email is already verified" });
        }
        // Check if there is a matching email verification OTP
        const emailVerification = await EmailVerifyModel.findOne({ userId: existingUser._id, otp });
        if (!emailVerification) {
            if (!existingUser.is_verified) {
                // console.log(existingUser);
                await sendEmailVerificationOTP(req, existingUser);
                return res.status(400).json({ status: false, message: "Invalid OTP, new OTP sent to your email" });
            }
            return res.status(400).json({ status: false, message: "Invalid OTP" });
        }
        // Check if OTP is expired
        const currentTime = new Date();
        // 15 * 60 * 1000 calculates the expiration period in milliseconds(15 minutes).
        const expirationTime = new Date(emailVerification.createdAt.getTime() + 15 * 60 * 1000);
        if (currentTime > expirationTime) {
            // OTP expired, send new OTP
            await sendEmailVerificationOTP(req, existingUser);
            return res.status(400).json({ status: "failed", message: "OTP expired, new OTP sent to your email" });
        }
        // OTP is valid and not expired, mark email as verified
        existingUser.is_verified = true;
        await existingUser.save();

        // Delete email verification document
        await EmailVerifyModel.deleteMany({ userId: existingUser._id });
        return res.status(200).json({ status: true, message: "Email verified successfully" });


    } catch (error) {
        console.error(error);
        res.status(500).json({ status: false, message: "Unable to verify email, please try again later" });
    }

}

    /**login api */
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
            //**is verified */
             // Check if user verified
             if (!user.is_verified) {
                return res.status(401).json({ status: false, message: "Your account is not verified" });
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



    /***reset password link*/

    async sendUserPasswordResetLink(req,res){

        try{
            const { email } = req.body;
            if (!email) {
              return res.status(400).json({ status:false, message: "Email field is required" });
            }
            const user = await userModel.findOne({ email });
            if (!user) {
              return res.status(404).json({ status:false, message: "Email doesn't exist" });
            }
            // Generate token for password reset
            const secret = user._id + process.env.JWT_SECRET;
            const token = jwt.sign({ userID: user._id }, secret, { expiresIn: '20m' });
            // Reset Link and this link generate by frontend developer
            const resetLink = `${process.env.FRONTEND_HOST}/account/reset-password-confirm/${user._id}/${token}`;
            //console.log(resetLink);
            // Send password reset email  
            await transporter.sendMail({
              from: process.env.EMAIL_FROM,
              to: user.email,
              subject: "Password Reset Link",
              html: `<p>Hello ${user.name},</p>
              <a href="${resetLink}">${resetLink}</a>
              <p>Please <a href="${resetLink}">Click here</a> to reset your password.</p>`
            });
            // Send success response
            res.status(200).json({ status:true, message: "Password reset email sent. Please check your email." });
      
          }catch(error){
            console.log(error);
            res.status(500).json({ status:false, message: "Unable to send password reset email. Please try again later." });
      
          }

    }


    /**reset password */

    async PasswordReset(req,res){
        try{
            const { password, confirm_password } = req.body;
           const { id, token } = req.params;
           const user = await userModel.findById(id);
           if (!user) {
             return res.status(404).json({ status:false, message: "User not found" });
           }
           // Validate token check 
           const new_secret = user._id + process.env.JWT_SECRET;
           jwt.verify(token, new_secret);
     
           if (!password || !confirm_password) {
             return res.status(400).json({ status:false, message: "New Password and Confirm New Password are required" });
           }
     
           if (password !== confirm_password) {
             return res.status(400).json({ status:false, message: "New Password and Confirm New Password don't match" });
           }
            // Generate salt and hash new password
            const salt = await bcrypt.genSalt(10);
            const newHashPassword = await bcrypt.hash(password, salt);
      
            // Update user's password
            await userModel.findByIdAndUpdate(user._id, { $set: { password: newHashPassword } });
      
            // Send success response
            res.status(200).json({ status: "success", message: "Password reset successfully" });
      
         }catch(error){
           return res.status(500).json({ status: "failed", message: "Unable to reset password. Please try again later." });
         }

    }

 
    /**forget password (for school name)*/

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

/**dashboard */

    async dashboard(req,res){
        return res.status(200).json({
           meaasge:"welcome to dashboard 👌👌👌👌👌"
        })
    }

}


module.exports=new UserController();