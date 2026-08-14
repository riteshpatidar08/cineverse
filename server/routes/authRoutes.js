
const express  = require('express');
const { register, login, verifyOtp, enabled2Fa, disabled2fa } = require('../controllers/authControllers.js');

const router  = express.Router() ;


router.post('/register' , register);
router.post('/login' , login)
router.post('/verify-otp' , verifyOtp)
router.post('/2fa/enable' , enabled2Fa)
router.post('/2fa/disable' , disabled2fa)
router.post('/resend-otp' , resendOtp)
 
module.exports = router