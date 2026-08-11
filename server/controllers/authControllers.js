const User = require('../models/userModel.js');
const { hashPassword, comparePassword } = require('../utils/bcrypt.js');
exports.register = async () => {
  try {
    const { name, email, mobileNo, password } = req.body;
    // validation middleware ;
    const user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({
        success: false,
        message: `you are already registered with this email ${email}`,
      });
    }
    const hash = await hashPassword(password);
    const newUser = await User.create({
      name,
      email,
      mobileNo,
      password: hash,
    });
  } catch (error) {}
};

exports.login = async () => {
  try {
  } catch (error) {}
};

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
