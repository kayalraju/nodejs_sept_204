const  bcrypt=require('bcryptjs');

const hashpassword=async(password)=>{
    try{
        const salt=await bcrypt.genSalt(10);
        const hashedPassword=await bcrypt.hash(password,salt);
        return hashedPassword;

    }catch(err){
        console.log(err);
    }
}

const comparepassword=async(password,hashedPassword)=>{
    return bcrypt.compare(password,hashedPassword);
}


module.exports={hashpassword,comparepassword}
