const mongoose = require("mongoose");

const Show = require("../models/showModel");
const Movie = require("../models/movieModel");
const Theater = require("../models/theaterModel");
const Screen = require("../models/ScreenModel");

require('dotenv').config();

const MONGO_URI = process.env.MONGODB_URI;

// -----------------------------------------------------
// CONFIGURATION
// -----------------------------------------------------

// Only generate shows for the next 2 days
const DAYS_TO_SEED = 2;

const SHOW_TIMES = [
  "09:30",
  "12:30",
  "15:30",
  "18:30",
  "21:30",
];

// Different theater chains have different screen categories and pricing
// Based on research of Jaipur theaters (PVR, INOX, Cinepolis, etc.)
const THEATER_CATEGORIES = {
  // PVR/INOX theaters
  "PVR": {
    categories: [
      { category: "CLASSIC", price: 200 },
      { category: "PRIME", price: 280 },
      { category: "GOLD", price: 450 },
      { category: "LUXE", price: 600 }
    ]
  },
  "INOX": {
    categories: [
      { category: "SILVER", price: 220 },
      { category: "GOLD", price: 300 },
      { category: "PLATINUM", price: 480 },
      { category: "INSIGNIA", price: 700 }
    ]
  },
  "Cinepolis": {
    categories: [
      { category: "NORMAL", price: 210 },
      { category: "PREMIUM", price: 320 },
      { category: "VIP", price: 550 }
    ]
  },
  "Rajmandir": {
    categories: [
      { category: "STALL", price: 180 },
      { category: "DRESS_CIRCLE", price: 250 },
      { category: "BALCONY", price: 350 }
    ]
  },
  "Miraj": {
    categories: [
      { category: "CLASSIC", price: 190 },
      { category: "EXECUTIVE", price: 270 },
      { category: "ROYAL", price: 420 }
    ]
  },
  // Default for other theaters
  "DEFAULT": {
    categories: [
      { category: "REGULAR", price: 200 },
      { category: "PREMIUM", price: 350 }
    ]
  }
};

// Map theater names to their category type
function getTheaterCategory(theaterName) {
  if (theaterName.includes("PVR")) return "PVR";
  if (theaterName.includes("INOX")) return "INOX";
  if (theaterName.includes("Cinepolis")) return "Cinepolis";
  if (theaterName.includes("Rajmandir")) return "Rajmandir";
  if (theaterName.includes("Miraj")) return "Miraj";
  return "DEFAULT";
}

// -----------------------------------------------------
// CREATE DATE + TIME
// -----------------------------------------------------

function createDateTime(date, time) {
  const [hours, minutes] = time.split(":").map(Number);
  const result = new Date(date);
  result.setHours(hours, minutes, 0, 0);
  return result;
}

// -----------------------------------------------------
// GENERATE SHOWS
// -----------------------------------------------------

function generateShows(movies, theaters, screens) {
  const shows = [];

  // Use TODAY's date
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  console.log(`\nSeeding shows starting from: ${today.toDateString()}`);

  // Create a map of screens by theater ID
  const screensByTheater = {};
  screens.forEach(screen => {
    const theaterId = screen.theater.toString();
    if (!screensByTheater[theaterId]) {
      screensByTheater[theaterId] = [];
    }
    screensByTheater[theaterId].push(screen);
  });

  theaters.forEach((theater) => {
    console.log(`Processing theater: ${theater.name}`);

    const theaterScreens = screensByTheater[theater._id.toString()] || [];
    
    if (theaterScreens.length === 0) {
      console.log(`  WARNING: ${theater.name} has no screens`);
      return;
    }

    // Get category pricing based on theater name
    const theaterCategory = getTheaterCategory(theater.name);
    const categoryPricing = THEATER_CATEGORIES[theaterCategory].categories;

    console.log(`  Theater type: ${theaterCategory}`);
    console.log(`  Screens found: ${theaterScreens.length}`);

    theaterScreens.forEach((screen) => {
      console.log(`    Processing ${screen.name}`);

      movies.forEach((movie) => {
        for (let day = 0; day < DAYS_TO_SEED; day++) {
          const showDate = new Date(today);
          showDate.setDate(today.getDate() + day);

          SHOW_TIMES.forEach((time) => {
            const startTime = createDateTime(showDate, time);

            shows.push({
              movie: movie._id,
              theater: theater._id,
              screenName: screen.name,
              showDate: new Date(showDate),
              startTime,
              categoryPricing: categoryPricing
            });
          });
        }
      });
    });
  });

  return shows;
}

// -----------------------------------------------------
// MAIN
// -----------------------------------------------------

async function seedShows() {
  try {
    console.log("\n==============================");
    console.log("SHOW SEEDER STARTED");
    console.log("==============================\n");

    // Connect
    console.log("Connecting to MongoDB...");
    await mongoose.connect(MONGO_URI);
    console.log("MongoDB connected successfully\n");

    // Get movies
    const movies = await Movie.find({});
    console.log(`Movies found: ${movies.length}`);

    if (movies.length === 0) {
      console.log("ERROR: No movies found in database.");
      console.log("Run your movie seeder first.");
      return;
    }

    // Get theaters
    const theaters = await Theater.find({});
    console.log(`Theaters found: ${theaters.length}`);

    if (theaters.length === 0) {
      console.log("ERROR: No theaters found in database.");
      console.log("Run your theater seeder first.");
      return;
    }

    // Get screens (separate model)
    const screens = await Screen.find({}).lean();
    console.log(`Screens found: ${screens.length}`);

    if (screens.length === 0) {
      console.log("ERROR: No screens found in database.");
      console.log("Run your screen seeder first.");
      return;
    }

    // Delete old shows
    console.log("\nDeleting old shows...");
    const deleted = await Show.deleteMany({});
    console.log(`Deleted ${deleted.deletedCount} old shows`);

    // Generate shows
    console.log(`\nGenerating shows for ${DAYS_TO_SEED} days...`);
    const shows = generateShows(movies, theaters, screens);
    console.log(`Generated ${shows.length} shows`);

    if (shows.length === 0) {
      console.log("ERROR: Generated 0 shows.");
      return;
    }

    // Show sample
    console.log("\nSample show:");
    console.log(JSON.stringify(shows[0], null, 2));

    // Insert
    console.log(`\nInserting ${shows.length} shows...`);
    const inserted = await Show.insertMany(shows);
    console.log(`SUCCESS: Inserted ${inserted.length} shows`);

    // Verify
    const count = await Show.countDocuments();
    console.log(`Shows currently in database: ${count}`);

    // Show category distribution
    console.log("\nCategory distribution by theater type:");
    const samplesByTheater = {};
    
    for (const theater of theaters) {
      const theaterCategory = getTheaterCategory(theater.name);
      if (!samplesByTheater[theaterCategory]) {
        const sample = shows.find(s => s.theater.toString() === theater._id.toString());
        if (sample) {
          samplesByTheater[theaterCategory] = sample.categoryPricing;
        }
      }
    }

    Object.keys(samplesByTheater).forEach(type => {
      console.log(`\n  ${type}:`);
      samplesByTheater[type].forEach(cat => {
        console.log(`    ${cat.category}: ₹${cat.price}`);
      });
    });

    // Close
    await mongoose.connection.close();
    console.log("\nMongoDB connection closed");
    console.log("\n==============================");
    console.log("SHOW SEEDER FINISHED SUCCESSFULLY");
    console.log("==============================\n");

  } catch (error) {
    console.error("\n==============================");
    console.error("SHOW SEEDER FAILED");
    console.error("==============================");
    console.error(error);

    if (mongoose.connection.readyState !== 0) {
      await mongoose.connection.close();
    }

    process.exit(1);
  }
}

seedShows();
