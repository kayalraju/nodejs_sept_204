const  bcrypt=require('bcryptjs');
const jwt=require('jsonwebtoken');
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



// Define AuthCheck middleware (function). When a user successfully login, he/she will be under protected route. So, this funciton (middleware) make a route protected. This function is used to check if a valid JSON Web Token (JWT) is provided with a request or not
const authCheck = async (req, res, next) => {
    // 1. Extract the Token from the incoming Request
    const token =
      req.body.token || req.query.token || req.headers["x-access-token"];
  
    // 2. Check if the Token is Present or not in incoming request. If the token not present, do the following
    if (!token) {
      return res.status(403).json({
        message: "A token is required for authentication",
      });
    }
  
    // 3. If the token present in incoming requrest, Verify the Token
    try {
      // 1. Verify the token and attach the decoded user to the request object
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = decoded;
  
      // 2. Control passes to the next middleware or route handler
      next();
    } catch (err) {
      console.log(err);
      return res.status(401).json({ message: "invalid Token Access" });
    }
  };

module.exports={hashpassword,comparepassword,authCheck}
