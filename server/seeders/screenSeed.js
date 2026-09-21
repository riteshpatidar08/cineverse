const mongoose = require("mongoose");
require('dotenv').config();

const Theater = require("../models/theaterModel");
const Screen = require("../models/ScreenModel");
const MONGO_URI = process.env.MONGODB_URI;

// Screen row configurations for different theater types
const screenConfigs = [
  {
    name: "Screen 1",
    rows: [
      // Regular seats: A-E
      {
        label: "A",
        category: "regular",
        seats: Array.from({ length: 24 }, (_, i) => ({ number: i + 1 })),
      },
      {
        label: "B",
        category: "regular",
        seats: Array.from({ length: 24 }, (_, i) => ({ number: i + 1 })),
      },
      {
        label: "C",
        category: "regular",
        seats: Array.from({ length: 24 }, (_, i) => ({ number: i + 1 })),
      },
      {
        label: "D",
        category: "regular",
        seats: Array.from({ length: 24 }, (_, i) => ({ number: i + 1 })),
      },
      {
        label: "E",
        category: "regular",
        seats: Array.from({ length: 24 }, (_, i) => ({ number: i + 1 })),
      },
      // Premium seats: F-J
      {
        label: "F",
        category: "premium",
        seats: Array.from({ length: 24 }, (_, i) => ({ number: i + 1 })),
      },
      {
        label: "G",
        category: "premium",
        seats: Array.from({ length: 24 }, (_, i) => ({ number: i + 1 })),
      },
      {
        label: "H",
        category: "premium",
        seats: Array.from({ length: 24 }, (_, i) => ({ number: i + 1 })),
      },
      {
        label: "I",
        category: "premium",
        seats: Array.from({ length: 24 }, (_, i) => ({ number: i + 1 })),
      },
      {
        label: "J",
        category: "premium",
        seats: Array.from({ length: 24 }, (_, i) => ({ number: i + 1 })),
      },
    ],
  },
  {
    name: "Screen 2",
    rows: [
      {
        label: "A",
        category: "regular",
        seats: Array.from({ length: 20 }, (_, i) => ({ number: i + 1 })),
      },
      {
        label: "B",
        category: "regular",
        seats: Array.from({ length: 20 }, (_, i) => ({ number: i + 1 })),
      },
      {
        label: "C",
        category: "regular",
        seats: Array.from({ length: 20 }, (_, i) => ({ number: i + 1 })),
      },
      {
        label: "D",
        category: "premium",
        seats: Array.from({ length: 20 }, (_, i) => ({ number: i + 1 })),
      },
      {
        label: "E",
        category: "premium",
        seats: Array.from({ length: 20 }, (_, i) => ({ number: i + 1 })),
      },
      {
        label: "F",
        category: "premium",
        seats: Array.from({ length: 20 }, (_, i) => ({ number: i + 1 })),
      },
      {
        label: "G",
        category: "premium",
        seats: Array.from({ length: 20 }, (_, i) => ({ number: i + 1 })),
      },
      {
        label: "H",
        category: "premium",
        seats: Array.from({ length: 20 }, (_, i) => ({ number: i + 1 })),
      },
      {
        label: "I",
        category: "premium",
        seats: Array.from({ length: 20 }, (_, i) => ({ number: i + 1 })),
      },
    ],
  },
  {
    name: "Screen 3",
    rows: [
      {
        label: "A",
        category: "regular",
        seats: Array.from({ length: 18 }, (_, i) => ({ number: i + 1 })),
      },
      {
        label: "B",
        category: "regular",
        seats: Array.from({ length: 18 }, (_, i) => ({ number: i + 1 })),
      },
      {
        label: "C",
        category: "regular",
        seats: Array.from({ length: 18 }, (_, i) => ({ number: i + 1 })),
      },
      {
        label: "D",
        category: "regular",
        seats: Array.from({ length: 18 }, (_, i) => ({ number: i + 1 })),
      },
      {
        label: "E",
        category: "premium",
        seats: Array.from({ length: 18 }, (_, i) => ({ number: i + 1 })),
      },
      {
        label: "F",
        category: "premium",
        seats: Array.from({ length: 18 }, (_, i) => ({ number: i + 1 })),
      },
      {
        label: "G",
        category: "premium",
        seats: Array.from({ length: 18 }, (_, i) => ({ number: i + 1 })),
      },
      {
        label: "H",
        category: "premium",
        seats: Array.from({ length: 18 }, (_, i) => ({ number: i + 1 })),
      },
    ],
  },
  {
    name: "Screen 4",
    rows: [
      {
        label: "A",
        category: "regular",
        seats: Array.from({ length: 15 }, (_, i) => ({ number: i + 1 })),
      },
      {
        label: "B",
        category: "regular",
        seats: Array.from({ length: 15 }, (_, i) => ({ number: i + 1 })),
      },
      {
        label: "C",
        category: "regular",
        seats: Array.from({ length: 15 }, (_, i) => ({ number: i + 1 })),
      },
      {
        label: "D",
        category: "premium",
        seats: Array.from({ length: 15 }, (_, i) => ({ number: i + 1 })),
      },
      {
        label: "E",
        category: "premium",
        seats: Array.from({ length: 15 }, (_, i) => ({ number: i + 1 })),
      },
      {
        label: "F",
        category: "premium",
        seats: Array.from({ length: 15 }, (_, i) => ({ number: i + 1 })),
      },
      {
        label: "G",
        category: "premium",
        seats: Array.from({ length: 15 }, (_, i) => ({ number: i + 1 })),
      },
    ],
  },
];

async function seedScreens() {
  try {
    console.log("\n==============================");
    console.log("SCREEN SEEDER STARTED");
    console.log("==============================\n");

    // Connect to MongoDB
    console.log("Connecting to MongoDB...");
    await mongoose.connect(MONGO_URI);
    console.log("MongoDB connected successfully\n");

    // Get all theaters
    console.log("Fetching theaters...");
    const theaters = await Theater.find().lean();
    console.log(`Found ${theaters.length} theaters\n`);

    if (theaters.length === 0) {
      console.log("❌ No theaters found. Run theater seeder first.");
      process.exit(1);
    }

    // Delete old screens
    console.log("Deleting old screens...");
    const deleteResult = await Screen.deleteMany({});
    console.log(`Deleted ${deleteResult.deletedCount} old screens\n`);

    // Create screens for each theater
    let totalScreensCreated = 0;
    const screensToInsert = [];

    console.log("Generating screens for each theater...\n");

    for (const theater of theaters) {
      const numScreens = Math.floor(Math.random() * 4) + 1; // 1-4 screens per theater
      const screensForTheater = screenConfigs.slice(0, numScreens);

      for (const screenConfig of screensForTheater) {
        screensToInsert.push({
          theater: theater._id,
          name: screenConfig.name,
          rows: screenConfig.rows,
        });

        totalScreensCreated++;
      }

      console.log(`  ✓ ${theater.name}: Adding ${screensForTheater.length} screen(s)`);
    }

    console.log(`\nInserting ${totalScreensCreated} screens...\n`);

    const createdScreens = await Screen.insertMany(screensToInsert);

    console.log(`✅ Successfully created ${createdScreens.length} screens\n`);

    // Display sample
    if (createdScreens.length > 0) {
      const sample = createdScreens[0];
      console.log("Sample screen created:");
      console.log(`  Theater ID: ${sample.theater}`);
      console.log(`  Screen Name: ${sample.name}`);
      console.log(`  Rows: ${sample.rows.length}`);
      sample.rows.forEach((row) => {
        console.log(
          `    Row ${row.label}: ${row.seats.length} ${row.category} seats`
        );
      });
    }

    console.log("\n==============================");
    console.log("SCREEN SEEDING COMPLETED");
    console.log("==============================\n");

    process.exit(0);
  } catch (error) {
    console.error("Error during screen seeding:", error);
    process.exit(1);
  }
}

// Run seeder
seedScreens();
