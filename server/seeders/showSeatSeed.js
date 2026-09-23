const mongoose = require("mongoose");
require('dotenv').config();

const Show = require("../models/showModel");
const ShowSeat = require("../models/showSeatModel");
const Screen = require("../models/ScreenModel");
const MONGO_URI = process.env.MONGODB_URI;

// Generate layout pattern: S for available, _ for booked
function generateLayoutPattern(seats, bookedSeats) {
  return seats
    .map((seat) => (bookedSeats.has(seat.number) ? "_" : "S"))
    .join("");
}

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

    // Get all shows
    console.log("Fetching all shows...");
    const shows = await Show.find().lean();
    console.log(`Found ${shows.length} shows\n`);

    if (shows.length === 0) {
      console.log("❌ No shows found. Run show seeder first.");
      process.exit(1);
    }

    // Get all screens
    console.log("Fetching all screens...");
    const screens = await Screen.find().lean();
    console.log(`Found ${screens.length} screens\n`);

    if (screens.length === 0) {
      console.log("❌ No screens found. Run screen seeder first.");
      process.exit(1);
    }

    // Create a map of screens by name
    const screensByName = {};
    screens.forEach((screen) => {
      screensByName[screen.name] = screen;
    });

    // Generate seats for each show
    let totalSeatsCreated = 0;
    const showSeatsToInsert = [];
    const screenUpdates = {}; // Track layout updates for each screen row

    console.log("Generating seats for each show...");

    for (const show of shows) {
      const screen = screensByName[show.screenName];

      if (!screen) {
        continue;
      }

      // For each row in the screen
      for (const rowLayout of screen.rows) {
        const bookedSeatsForThisRow = new Set();
        
        // Generate seat records for this row
        for (const seat of rowLayout.seats) {
          const seatId = `${rowLayout.label}${seat.number}`;

          // Randomly book some seats (20% booked rate)
          const isBooked = Math.random() < 0.2;
          
          if (isBooked) {
            bookedSeatsForThisRow.add(seat.number);
          }

          showSeatsToInsert.push({
            show: show._id,
            seatId,
            status: isBooked ? "booked" : "available",
            price: rowLayout.category === "premium" ? 350 : 220,
          });

          totalSeatsCreated++;
        }

        // Generate layout pattern for this row/show combination
        const layoutPattern = generateLayoutPattern(
          rowLayout.seats,
          bookedSeatsForThisRow
        );

        // Store unique key for tracking updates
        const updateKey = `${screen._id}-${rowLayout.label}`;
        screenUpdates[updateKey] = layoutPattern;
      }

      // Log progress every 500 shows
      if (shows.indexOf(show) % 500 === 0) {
        console.log(`  Processing show ${shows.indexOf(show) + 1}/${shows.length}...`);
      }
    }

    console.log(`\nGenerated ${totalSeatsCreated} seat records\n`);

    // Update screens with layout patterns
    console.log("Updating screen layouts...");
    let layoutsUpdated = 0;
    for (const screen of screens) {
      const updatedRows = screen.rows.map((row) => {
        const key = `${screen._id}-${row.label}`;
        if (screenUpdates[key]) {
          row.layout = screenUpdates[key];
          layoutsUpdated++;
        }
        return row;
      });

      await Screen.findByIdAndUpdate(screen._id, { rows: updatedRows });
    }
    console.log(`Updated ${layoutsUpdated} row layouts\n`);

    // Insert seats in batches to avoid memory issues
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

    // Sample layout display
    const sampleScreen = await Screen.findOne().lean();
    if (sampleScreen && sampleScreen.rows.length > 0) {
      console.log("\nSample Layout Patterns:");
      sampleScreen.rows.slice(0, 3).forEach((row) => {
        console.log(`  Row ${row.label}: ${row.layout}`);
      });
    }

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
