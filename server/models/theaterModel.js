const mongoose = require('mongoose');

const theaterSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    city: { type: String, required: true },
    location: {
      type: {
        type: String,
        default: 'Point',
      },
      coordinates: {
        type: [Number], // [longitude, latitude]
        required: true,
      },
    },
    // Tenant Reference - assigned theater manager
    admin: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    facilities: [{ type: String }], // e.g. ['Dolby Atmos', '4K Laser', 'Recliner', 'Parking', 'Food Court']
    address: { type: String },
    contactPhone: { type: String },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

theaterSchema.index({ location: '2dsphere' });
const Theater = mongoose.model('Theater', theaterSchema);
module.exports = Theater;

