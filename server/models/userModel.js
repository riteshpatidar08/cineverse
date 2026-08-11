const mongoose = require('mongoose');

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String   , unique : true},
    mobileNo: {
      type: String,
      validate: {

        validator: function (v) {
          return /^(?:\+91|91|0)?[6-9]\d{9}$/.test(v);
        },
        message: (props) => `${props.value} is not a valid phone number!`,
      },

      required: [true, 'User phone number required'],
    },
    password: { type: String  , required : [true , 'Password is required']},
    isActive: { type: Boolean, default: true },
    role: { type: String, enum: ['user', 'theatreAdmin', 'admin'] , deafult : 'user' },
    avatar: { type: String },
    is2FAEnabled: { type: Boolean, default: false },
    otp2FA: {
      type: String,
    },
    otpExpires: {
      type: Date,
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

const User = mongoose.model('User', userSchema);
