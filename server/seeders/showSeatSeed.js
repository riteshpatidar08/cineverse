const mongoose = require("mongoose");
require('dotenv').config();

const Show = require("../models/showModel");
const ShowSeat = require("../models/showSeatModel");
const Theater = require("../models/theaterModel");
const MONGO_URI = process.env.MONGODB_URI;

async function seedShowSeats() {
  try {
    console.log("\n==============================");
    console.log("SHOW SEAT SEEDER STARTED");
    console.log("==============================\n");

    // Connect to MongoDB
    console.log("Connecting to MongoDB...");
    await mongoose.connect(MONGO_URI);
    console.log("MongoDB connected successfully\n");

    // Delete old show seats
    console.log("Deleting old show seats...");
    const deleteResult = await ShowSeat.deleteMany({});
    console.log(`Deleted ${deleteResult.deletedCount} old show seats\n`);

    // Get all shows with theater info (to get seatLayout)
    console.log("Fetching all shows...");
    const shows = await Show.find()
      .populate({
        path: "theater",
        select: "screens",
      })
      .lean();

    console.log(`Found ${shows.length} shows\n`);

    if (shows.length === 0) {
      console.log("❌ No shows found. Run show seeder first.");
      process.exit(1);
    }

    // Generate seats for each show
    let totalSeatsCreated = 0;
    const showSeatsToInsert = [];

    console.log("Generating seats for each show...");

    for (const show of shows) {
      if (!show.theater || !show.theater.screens || show.theater.screens.length === 0) {
        console.log(`  ⚠️  Show ${show._id} has no theater/screens, skipping...`);
        continue;
      }

      // Find the screen that matches this show
      const screen = show.theater.screens.find(
        (s) => s.screenName === show.screenName
      );

      if (!screen) {
        console.log(`  ⚠️  Show ${show._id} screen not found, skipping...`);
        continue;
      }

      // Generate seats for each row in the screen's seatLayout
      for (const rowLayout of screen.seatLayout) {
        for (const seatNum of rowLayout.seats) {
          const seatId = `${rowLayout.row}${seatNum}`;

          // Randomly book some seats (20% booked rate)
          const isBooked = Math.random() < 0.2;

          showSeatsToInsert.push({
            show: show._id,
            seatId,
            status: isBooked ? "booked" : "available",
            price: rowLayout.seatPrice,
          });

          totalSeatsCreated++;
        }
      }

      // Log progress every 100 shows
      if (shows.indexOf(show) % 100 === 0) {
        console.log(`  Processing show ${shows.indexOf(show) + 1}/${shows.length}...`);
      }
    }

    console.log(`Generated ${totalSeatsCreated} seat records\n`);

    // Insert in batches to avoid memory issues
    const BATCH_SIZE = 5000;
    console.log(`Inserting seats in batches of ${BATCH_SIZE}...\n`);

    for (let i = 0; i < showSeatsToInsert.length; i += BATCH_SIZE) {
      const batch = showSeatsToInsert.slice(i, i + BATCH_SIZE);
      await ShowSeat.insertMany(batch);

      const progress = Math.min(i + BATCH_SIZE, showSeatsToInsert.length);
      console.log(`  ✓ Inserted ${progress}/${totalSeatsCreated} seats`);
    }

    console.log(`\n✅ Successfully created ${totalSeatsCreated} show seats\n`);

    // Display stats
    const stats = await ShowSeat.aggregate([
      {
        $group: {
          _id: "$status",
          count: { $sum: 1 },
        },
      },
    ]);

    console.log("Seat Status Distribution:");
    stats.forEach((stat) => {
      const percentage = ((stat.count / totalSeatsCreated) * 100).toFixed(1);
      console.log(`  ${stat._id}: ${stat.count} (${percentage}%)`);
    });

    console.log("\n==============================");
    console.log("SHOW SEAT SEEDING COMPLETED");
    console.log("==============================\n");

    process.exit(0);
  } catch (error) {
    console.error("Error during show seat seeding:", error);
    process.exit(1);
  }
}

// Run seeder
seedShowSeats();
