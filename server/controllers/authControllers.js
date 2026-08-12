const User = require('../models/userModel.js');
const asyncHandler = require('express-async-handler')
const { hashPassword, comparePassword } = require('../utils/bcrypt.js');


exports.register = async (req,res,next) => {
  try {
    const { name, email, mobileNo, password } = req.body;
    // validation middleware ;
    const user = await User.findOne({ email });
    if (user) {
     const error = new Error(`you are already registered with this email ${email}`,);
     error.statusCode = 409
     throw error;
    }
    const hash = await hashPassword(password);

    const newUser = await User.create({
      name,
      email,
      mobileNo,
      password: hash,
    });
  } catch (error) {
    next(error)
  }
};

exports.login = asyncHandler(async () => {
const {email , password}  = req.body ;
const user = await User.findOne({email}) ;

if(!user){
  const error = new Error("Account is not registred");
  error.statusCode = 400;
  throw error
}

const isPasswordMatch = await comparePassword(password , user.password)
if(!isPasswordMatch){
  const error = new Error("Password is incorrect");
  error.statusCode = 401;
  throw error
}

//2fa user.is2faEnabled : agar true hogi then i have to send the otp ;
if(!user.is2faEnabled){
  //generate ttoke
  // res.cookie('token')


  
  //generate otp , claculate the expiry time then send the otp to the mail and send the response with 2faIsRequired field message : "OTP IS SUCCESSFULLY SENT ON YOUR REGISTED NUMBER"

 return   res.status(200).json({
  message : "success"
 })
}


exports.enabled2Fa = async () => {
  try {
  } catch (error) {}
};

exports.disabled2fa = async () => {
  try {
  } catch (error) {}
};

exports.verifyOtp = async () => {
  try {

  } catch (error) {


  }
};

exports.resendOtp = async () => {
  try {
    
  } catch (error) {

  }
};
