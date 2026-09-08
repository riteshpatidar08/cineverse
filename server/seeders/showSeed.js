const mongoose = require("mongoose");

const Show = require("../models/showModel");
const Movie = require("../models/movieModel");
const Theater = require("../models/theaterModel");

const MONGO_URI =
  process.env.MONGO_URI 

// -----------------------------------------------------
// CONFIGURATION
// -----------------------------------------------------
const DAYS_TO_SEED = 7;

const SHOW_TIMES = [
  "09:30",
  "12:30",
  "15:30",
  "18:30",
  "21:30",
];

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
// GENERATE SEATS FOR A SHOW
// -----------------------------------------------------

function generateSeatStatus(screen) {
  const seats = [];

  if (!screen.seatLayout) {
    console.log(
      `WARNING: ${screen.screenName} has no seatLayout`
    );

    return seats;
  }

  screen.seatLayout.forEach((row) => {
    if (!row.seats) return;

    row.seats.forEach((seatNumber) => {
      seats.push({
        seatRow: row.row,
        seatNumber: String(seatNumber),
        seatCategory: row.seatCategory,
        seatPrice: row.seatPrice,
        isBooked: false,
      });
    });
  });

  return seats;
}

// -----------------------------------------------------
// GENERATE SHOWS
// -----------------------------------------------------

function generateShows(movies, theaters) {
  const shows = [];

  const today = new Date();

  today.setHours(0, 0, 0, 0);

  theaters.forEach((theater) => {
    console.log(
      `Processing theater: ${theater.name}`
    );

    if (!theater.screens || theater.screens.length === 0) {
      console.log(
        `WARNING: ${theater.name} has no screens`
      );

      return;
    }

    theater.screens.forEach((screen) => {
      console.log(
        `  Processing ${screen.screenName}`
      );

      movies.forEach((movie) => {
        for (let day = 0; day < DAYS_TO_SEED; day++) {
          const showDate = new Date(today);

          showDate.setDate(
            today.getDate() + day
          );

          SHOW_TIMES.forEach((time) => {
            const startTime = createDateTime(
              showDate,
              time
            );

            const seatStatus =
              generateSeatStatus(screen);

            shows.push({
              movie: movie._id,
              theater: theater._id,
              screenName: screen.screenName,
              showDate,
              startTime,
              seatStatus,
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

    // -------------------------------------------------
    // CONNECT
    // -------------------------------------------------

    console.log("Connecting to MongoDB...");

    await mongoose.connect(MONGO_URI);

    console.log("MongoDB connected successfully\n");

    // -------------------------------------------------
    // MOVIES
    // -------------------------------------------------

    const movies = await Movie.find({});

    console.log(
      `Movies found: ${movies.length}`
    );

    if (movies.length === 0) {
      console.log(
        "ERROR: No movies found in database."
      );

      console.log(
        "Run your movie seeder first."
      );

      return;
    }

    // -------------------------------------------------
    // THEATERS
    // -------------------------------------------------

    const theaters = await Theater.find({});

    console.log(
      `Theaters found: ${theaters.length}`
    );

    if (theaters.length === 0) {
      console.log(
        "ERROR: No theaters found in database."
      );

      console.log(
        "Run your theater seeder first."
      );

      return;
    }

    // -------------------------------------------------
    // SCREEN COUNT
    // -------------------------------------------------

    let totalScreens = 0;

    theaters.forEach((theater) => {
      const count = theater.screens
        ? theater.screens.length
        : 0;

      totalScreens += count;

      console.log(
        `${theater.name}: ${count} screens`
      );
    });

    console.log(
      `\nTotal screens: ${totalScreens}`
    );

    if (totalScreens === 0) {
      console.log(
        "ERROR: No screens found inside theaters."
      );

      return;
    }

    // -------------------------------------------------
    // DELETE OLD SHOWS
    // -------------------------------------------------

    console.log("\nDeleting old shows...");

    const deleted =
      await Show.deleteMany({});

    console.log(
      `Deleted ${deleted.deletedCount} old shows`
    );

    // -------------------------------------------------
    // GENERATE
    // -------------------------------------------------

    console.log("\nGenerating shows...");

    const shows = generateShows(
      movies,
      theaters
    );

    console.log(
      `Generated ${shows.length} shows`
    );

    // -------------------------------------------------
    // CHECK
    // -------------------------------------------------

    if (shows.length === 0) {
      console.log(
        "ERROR: Generated 0 shows."
      );

      return;
    }

    // -------------------------------------------------
    // CHECK FIRST SHOW
    // -------------------------------------------------

    console.log(
      "\nFirst generated show:"
    );

    console.log(
      JSON.stringify(
        shows[0],
        null,
        2
      )
    );

    // -------------------------------------------------
    // INSERT
    // -------------------------------------------------

    console.log("\nInserting shows...");
console.log(shows)
    const inserted =
      await Show.insertMany(shows);

    console.log(
      `\nSUCCESS: Inserted ${inserted.length} shows`
    );

    // -------------------------------------------------
    // VERIFY
    // -------------------------------------------------

    const count =
      await Show.countDocuments();

    console.log(
      `Shows currently in database: ${count}`
    );

    // -------------------------------------------------
    // CLOSE
    // -------------------------------------------------

    await mongoose.connection.close();

    console.log(
      "\nMongoDB connection closed"
    );

    console.log(
      "SHOW SEEDER FINISHED SUCCESSFULLY"
    );
  } catch (error) {
    console.error(
      "\n=============================="
    );

    console.error(
      "SHOW SEEDER FAILED"
    );

    console.error(
      "=============================="
    );

    console.error(error);

    if (
      mongoose.connection.readyState !== 0
    ) {
      await mongoose.connection.close();
    }

    process.exit(1);
  }
}

seedShows();