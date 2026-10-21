const mongoose = require('mongoose');

const settlementSchema = new mongoose.Schema(
  {
    theater: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Theater',
      required: true,
    },
    cycle: {
      type: String,
      required: true,
    },
    totalGrossSales: {
      type: Number,
      required: true,
      default: 0,
    },
    platformCommission: {
      type: Number,
      required: true,
      default: 0,
    },
    netPayableToTheater: {
      type: Number,
      required: true,
      default: 0,
    },
    settlementStatus: {
      type: String,
      enum: ['pending', 'processing', 'settled'],
      default: 'pending',
    },
    paymentReference: {
      type: String,
    },
    paidAt: {
      type: Date,
    },
    notes: {
      type: String,
    },
  },
  { timestamps: true }
);

const Settlement = mongoose.model('Settlement', settlementSchema);
module.exports = Settlement;
