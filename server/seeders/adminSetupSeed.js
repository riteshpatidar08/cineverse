const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../.env') });
const mongoose = require('mongoose');
const User = require('../models/userModel.js');
const Theater = require('../models/theaterModel.js');
const Screen = require('../models/ScreenModel.js');
const Movie = require('../models/movieModel.js');
const Show = require('../models/showModel.js');
const ShowSeat = require('../models/showSeatModel.js');
const { hashPassword } = require('../utils/bcrypt.js');

const MONGO_URI = process.env.MONGODB_URI || process.env.MONGO_URI;

async function seedAdminUsers() {
  try {
    await mongoose.connect(MONGO_URI);
    console.log('MongoDB connected for admin setup');

    const hashedPassword = await hashPassword('Admin@123');

    // 1. Setup Platform Admin
    let admin = await User.findOne({ email: 'admin@cineverse.com' });
    if (!admin) {
      admin = await User.create({
        name: 'Super Admin',
        email: 'admin@cineverse.com',
        mobileNo: '9876543210',
        password: hashedPassword,
        role: 'admin',
        isActive: true,
        isVerified: true,
      });
      console.log('✓ Created Platform Admin (admin@cineverse.com / Admin@123)');
    } else {
      admin.password = hashedPassword;
      admin.role = 'admin';
      admin.isActive = true;
      await admin.save();
      console.log('✓ Updated Platform Admin (admin@cineverse.com / Admin@123)');
    }

    // 2. Setup Theater Admin
    let theatreAdmin = await User.findOne({ email: 'theatreadmin@cineverse.com' });
    if (!theatreAdmin) {
      theatreAdmin = await User.create({
        name: 'Vikram Rathore',
        email: 'theatreadmin@cineverse.com',
        mobileNo: '9829012345',
        password: hashedPassword,
        role: 'theatreAdmin',
        isActive: true,
        isVerified: true,
      });
      console.log(
        '✓ Created Theater Admin (theatreadmin@cineverse.com / Admin@123)'
      );
    } else {
      theatreAdmin.password = hashedPassword;
      theatreAdmin.role = 'theatreAdmin';
      theatreAdmin.isActive = true;
      await theatreAdmin.save();
      console.log(
        '✓ Updated Theater Admin (theatreadmin@cineverse.com / Admin@123)'
      );
    }

    // 3. Assign Theater to Theater Admin
    let theater = await Theater.findOne({ name: 'PVR Mall of Jaipur' });
    if (!theater) {
      theater = await Theater.findOne();
    }

    if (theater) {
      theater.admin = theatreAdmin._id;
      theater.facilities = [
        'Dolby Atmos',
        '4K Laser Projection',
        'Recliner Seating',
        'Gourmet Food Court',
        'Valet Parking',
        'Wheelchair Accessible',
      ];
      theater.address = '4th Floor, Mall of Jaipur, Gandhi Path, Jaipur, Rajasthan';
      theater.contactPhone = '+91 141 4099888';
      theater.isActive = true;
      await theater.save();
      console.log(`✓ Assigned theater "${theater.name}" to Theater Admin`);

      // Ensure at least one screen exists for this theater
      let screen = await Screen.findOne({ theater: theater._id });
      if (!screen) {
        screen = await Screen.create({
          theater: theater._id,
          name: 'Screen 1 - Dolby Atmos',
          rows: [
            {
              label: 'A',
              category: 'RECLINER',
              layout: 'LLLL_RRRR',
              start: 1,
              spaceAfter: 4,
              seats: Array.from({ length: 8 }, (_, i) => ({ number: i + 1 })),
            },
            {
              label: 'B',
              category: 'PREMIUM',
              layout: 'LLLLLL_RRRRRR',
              start: 1,
              spaceAfter: 6,
              seats: Array.from({ length: 12 }, (_, i) => ({ number: i + 1 })),
            },
            {
              label: 'C',
              category: 'REGULAR',
              layout: 'LLLLLLLL_RRRRRRRR',
              start: 1,
              spaceAfter: 8,
              seats: Array.from({ length: 16 }, (_, i) => ({ number: i + 1 })),
            },
          ],
        });
        console.log(`✓ Created default screen "${screen.name}"`);
      }
    }

    console.log('\nAdmin setup successfully completed!');
    await mongoose.connection.close();
    process.exit(0);
  } catch (error) {
    console.error('Admin setup failed:', error);
    process.exit(1);
  }
}

seedAdminUsers();
