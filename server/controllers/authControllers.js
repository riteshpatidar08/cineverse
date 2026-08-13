const User = require('../models/userModel.js');
const asyncHandler = require('express-async-handler');
const { hashPassword, comparePassword } = require('../utils/bcrypt.js');
const jwt = require('jsonwebtoken');
const generateToken = require('../utils/jwt.js');

exports.register = async (req, res, next) => {
  try {
    const { name, email, mobileNo, password } = req.body;
    // validation middleware ;
    const user = await User.findOne({ email });
    if (user) {
      const error = new Error(
        `you are already registered with this email ${email}`
      );
      error.statusCode = 409;
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
    next(error);
  }
};

exports.login = asyncHandler(async () => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });

  if (!user) {
    const error = new Error('Account is not registred');
    error.statusCode = 400;
    throw error;
  }

  const isPasswordMatch = await comparePassword(password, user.password);
  if (!isPasswordMatch) {
    const error = new Error('Password is incorrect');
    error.statusCode = 401;
    throw error;
  }

  //note if 2fa is not enabled then generate a token and set the token in response cookie of the currrent req Set-Cookie= token=ettudufsuallkd
  if (!user.is2faEnabled) {
    const token = generateToken(
      { id: user._id, name: user.name, email: user.email, role: user.role },
      '7d'
    );

    res.cookie('token', token, {
      httpOnly: true,
    });

    return res.status(200).json({
      message: 'success',
    });
  }

  //generate the otp update the otp field and otpexpires filed in the user modole
  const OTP = Math.floor(100000 + Math.random() * 900000).toString();

  user.otp2fa = OTP;
  user.otpExpires = Date.now() + 60 * 1000;
  await user.save();

  res.send('OTP IS SUCCESSFULLY SENT ON YOUR REGISTERED EMAIL..');
  //generate otp , claculate the expiry time then send the otp to the mail and send the response with 2faIsRequired field message : "OTP IS SUCCESSFULLY SENT ON YOUR REGISTED NUMBER"
});

exports.enabled2Fa = asyncHandler(async () => {
  const { id, status } = req.body;
  const user = await User.findById(id);
  user.is2faEnabled = status;
  await user.save();
});

exports.disabled2fa = asyncHandler(async () => {
  const { id, status } = req.body;
  const user = await User.findById(id);
  user.is2faEnabled = status;
});

exports.verifyOtp = asyncHandler(async () => {
  const { otp, id } = req.body;

  const user = await User.findById(id);
  const existingOTP = user.otp2fa;
  if (existingOTP !== otp) {
    return res.status(400).json({
      message: 'otp is not matched',
    });
  }
  if (new Date() > user.otpExpires) {
    return res.status(400).json({
      message: 'OTP is expired',
    });
  }
  const token = generateToken(
    { id: user._id, name: user.name, email: user.email, role: user.role },
    '7d'
  );

  res.cookie('token', token, {
    httpOnly: true,
  });

  return res.status(200).json({
    message: 'success',
  });
});

exports.resendOtp = async () => {
  try {
  } catch (error) {}
};
