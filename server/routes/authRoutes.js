
const express  = require('express');
const { register, login, verifyOtp, enabled2Fa, disabled2fa ,resendOtp , verify } = require('../controllers/authControllers.js');
const verifyToken = require('../middlewares/verifyToken.js')

const router  = express.Router() ;


router.post('/register' , register);
router.post('/login' , login)
router.post('/verify-otp' , verifyOtp)
router.post('/2fa/enable' , enabled2Fa)
router.post('/2fa/disable' , disabled2fa)
router.post('/resend-otp' , resendOtp)
 router.post('/verify' , verifyToken , verify)
module.exports = router