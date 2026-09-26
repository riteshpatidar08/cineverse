const mongoose = require("mongoose");
require('dotenv').config();

const Show = require("../models/showModel");
const ShowSeat = require("../models/showSeatModel");
const Screen = require("../models/ScreenModel");
const MONGO_URI = process.env.MONGODB_URI;

// Fake user IDs to simulate locked seats
const FAKE_USER_IDS = [
  "user_abc123", "user_def456", "user_ghi789",
  "user_jkl012", "user_mno345", "user_pqr678",
];

// Distribution: 75% available, 15% booked, 10% locked
function getSeatStatus() {
  const rand = Math.random();
  if (rand < 0.75) return "available";
  if (rand < 0.90) return "booked";
  return "locked";
}

function getLockedExpiry() {
  // Lock expires between 5 and 15 minutes from now
  const now = new Date();
  const minutesAhead = Math.floor(Math.random() * 10) + 5;
  return new Date(now.getTime() + minutesAhead * 60 * 1000);
}

async function seedShowSeats() {
  try {
    console.log("\n==============================");
    console.log("SHOW SEAT SEEDER STARTED");
    console.log("==============================\n");

    console.log("Connecting to MongoDB...");
    await mongoose.connect(MONGO_URI);
    console.log("MongoDB connected successfully\n");

    // Delete old show seats
    console.log("Deleting old show seats...");
    const deleteResult = await ShowSeat.deleteMany({});
    console.log(`Deleted ${deleteResult.deletedCount} old show seats\n`);

    // Fetch all shows
    console.log("Fetching all shows...");
    const shows = await Show.find().lean();
    console.log(`Found ${shows.length} shows\n`);

    if (shows.length === 0) {
      console.log("❌ No shows found. Run show seeder first.");
      process.exit(1);
    }

    // Fetch all screens
    console.log("Fetching all screens...");
    const screens = await Screen.find().lean();
    console.log(`Found ${screens.length} screens\n`);

    if (screens.length === 0) {
      console.log("❌ No screens found. Run screen seeder first.");
      process.exit(1);
    }

    // Map screens by theater + name
    const screenMap = {};
    screens.forEach((screen) => {
      const key = `${screen.theater}_${screen.name}`;
      screenMap[key] = screen;
    });

    // Generate seat records
    let totalSeatsCreated = 0;
    let skippedShows = 0;
    const showSeatsToInsert = [];

    const statusCount = { available: 0, booked: 0, locked: 0 };

    console.log("Generating seats for each show...\n");

    for (let i = 0; i < shows.length; i++) {
      const show = shows[i];
      const screenKey = `${show.theater}_${show.screenName}`;
      const screen = screenMap[screenKey];

      if (!screen) {
        skippedShows++;
        continue;
      }

      for (const row of screen.rows) {
        // Get price from show's categoryPricing matching the row category
        let price = 220; // default fallback
        const matched = show.categoryPricing?.find(
          (cp) => cp.category.toLowerCase() === row.category.toLowerCase()
        );
        if (matched) price = matched.price;

        for (const seat of row.seats) {
          const seatId = `${row.label}${seat.number}`;
          const status = getSeatStatus();

          const doc = {
            show: show._id,
            seatId,
            status,
            price,
          };

          // Add lock fields only for locked seats
          if (status === "locked") {
            doc.lockedBy = FAKE_USER_IDS[Math.floor(Math.random() * FAKE_USER_IDS.length)];
            doc.lockedExpiresAt = getLockedExpiry();
          }

          showSeatsToInsert.push(doc);
          statusCount[status]++;
          totalSeatsCreated++;
        }
      }

      if (i % 500 === 0) {
        console.log(`  Processing show ${i + 1}/${shows.length}...`);
      }
    }

    console.log(`\nGenerated ${totalSeatsCreated} seat records`);
    console.log(`Skipped ${skippedShows} shows (screen not found)\n`);

    // Insert in batches
    const BATCH_SIZE = 5000;
    console.log(`Inserting seats in batches of ${BATCH_SIZE}...\n`);

    for (let i = 0; i < showSeatsToInsert.length; i += BATCH_SIZE) {
      const batch = showSeatsToInsert.slice(i, i + BATCH_SIZE);
      await ShowSeat.insertMany(batch);
      const progress = Math.min(i + BATCH_SIZE, showSeatsToInsert.length);
      console.log(`  ✓ Inserted ${progress}/${totalSeatsCreated} seats`);
    }

    console.log(`\n✅ Successfully created ${totalSeatsCreated} show seats\n`);

    // Stats
    console.log("Seat Status Distribution:");
    Object.entries(statusCount).forEach(([status, count]) => {
      const pct = ((count / totalSeatsCreated) * 100).toFixed(1);
      console.log(`  ${status}: ${count} (${pct}%)`);
    });

    // Sample verification
    console.log("\nSample ShowSeat documents:");
    const samples = await ShowSeat.find().limit(5).lean();
    samples.forEach((s, idx) => {
      console.log(`\n  [${idx + 1}] Show: ${s.show} | Seat: ${s.seatId} | Status: ${s.status} | Price: ₹${s.price}`);
      if (s.status === "locked") {
        console.log(`       LockedBy: ${s.lockedBy} | Expires: ${s.lockedExpiresAt}`);
      }
    });

    // Verify one locked seat sample
    const lockedSample = await ShowSeat.findOne({ status: "locked" }).lean();
    if (lockedSample) {
      console.log(`\n✅ Locked seat sample:`);
      console.log(`   Show: ${lockedSample.show}`);
      console.log(`   Seat: ${lockedSample.seatId}`);
      console.log(`   LockedBy: ${lockedSample.lockedBy}`);
      console.log(`   Expires: ${lockedSample.lockedExpiresAt}`);
    }

    // Verify show reference
    const validShow = await Show.findById(samples[0]?.show);
    console.log(`\n${validShow ? "✅" : "❌"} Show reference ${validShow ? "valid" : "INVALID"}: ${samples[0]?.show}`);

    console.log("\n==============================");
    console.log("SHOW SEAT SEEDING COMPLETED");
    console.log("==============================\n");

    process.exit(0);
  } catch (error) {
    console.error("Error during show seat seeding:", error);
    process.exit(1);
  }
}

seedShowSeats();
