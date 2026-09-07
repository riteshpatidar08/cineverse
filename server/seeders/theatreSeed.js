// seed/theater.seed.js

const mongoose = require("mongoose");
const Theater = require("../models/theaterModel");

const {
  generateScreen,
} = require("../utils/generateSeats");

const MONGO_URI =
  process.env.MONGO_URI ||
  'mongodb+srv://riteshpatidar088:UHE0MNXcbIXxzukJ@cluster0.b2vgi2d.mongodb.net/CineVerse?appName=Cluster0'


// -----------------------------------------------------
// SCREEN CONFIGURATIONS
// -----------------------------------------------------

const smallScreen = (screenName) =>
  generateScreen({
    screenName,
    rows: ["A", "B", "C", "D", "E", "F"],
    seatsPerRow: 15,

    premiumRows: ["E", "F"],

    normalPrice: 180,
    premiumPrice: 250,
  });


const mediumScreen = (screenName) =>
  generateScreen({
    screenName,
    rows: [
      "A",
      "B",
      "C",
      "D",
      "E",
      "F",
      "G",
      "H",
    ],

    seatsPerRow: 20,

    premiumRows: ["F", "G", "H"],

    normalPrice: 200,
    premiumPrice: 300,
  });


const largeScreen = (screenName) =>
  generateScreen({
    screenName,
    rows: [
      "A",
      "B",
      "C",
      "D",
      "E",
      "F",
      "G",
      "H",
      "I",
      "J",
    ],

    seatsPerRow: 24,

    premiumRows: ["G", "H", "I", "J"],

    normalPrice: 220,
    premiumPrice: 350,
  });


const reclinerScreen = (screenName) =>
  generateScreen({
    screenName,

    rows: [
      "A",
      "B",
      "C",
      "D",
      "E",
      "F",
    ],

    seatsPerRow: 16,

    premiumRows: ["C", "D"],
    reclinerRows: ["E", "F"],

    normalPrice: 220,
    premiumPrice: 350,
    reclinerPrice: 550,
  });


// -----------------------------------------------------
// THEATERS
// -----------------------------------------------------

const theaters = [

  // ===================================================
  // RAJ MANDIR
  // ===================================================

  {
    name: "Rajmandir Cinema",
    city: "Jaipur",

    location: {
      type: "Point",
      coordinates: [
        75.8101639,
        26.9154985,
      ],
    },

    screens: [
      largeScreen("Screen 1"),
    ],
  },


  // ===================================================
  // GEM CINEMA
  // ===================================================

  {
    name: "GEM Cinema",
    city: "Jaipur",

    location: {
      type: "Point",
      coordinates: [
        75.8219542,
        26.915726,
      ],
    },

    screens: [
      mediumScreen("Screen 1"),
    ],
  },


  // ===================================================
  // GOLCHA CINEMA
  // ===================================================

  {
    name: "Golcha Cinema",
    city: "Jaipur",

    location: {
      type: "Point",
      coordinates: [
        75.824,
        26.916,
      ],
    },

    screens: [
      largeScreen("Screen 1"),
    ],
  },


  // ===================================================
  // PARAS CINEMA
  // ===================================================

  {
    name: "Paras Cinema",
    city: "Jaipur",

    location: {
      type: "Point",
      coordinates: [
        75.834194,
        26.934918,
      ],
    },

    screens: [
      largeScreen("Screen 1"),
    ],
  },


  // ===================================================
  // CINEPOLIS WORLD TRADE PARK
  // 4 screens / 892 seats publicly documented
  // ===================================================

  {
    name: "Cinepolis World Trade Park",
    city: "Jaipur",

    location: {
      type: "Point",
      coordinates: [
        75.80506,
        26.85323,
      ],
    },

    screens: [
      mediumScreen("Screen 1"),
      mediumScreen("Screen 2"),
      mediumScreen("Screen 3"),
      mediumScreen("Screen 4"),
    ],
  },


  // ===================================================
  // CINEPOLIS JEWEL OF INDIA
  // ===================================================

  {
    name: "Cinepolis Jewel of India",
    city: "Jaipur",

    location: {
      type: "Point",
      coordinates: [
        75.8051,
        26.857,
      ],
    },

    screens: [
      mediumScreen("Screen 1"),
      mediumScreen("Screen 2"),
      mediumScreen("Screen 3"),
      mediumScreen("Screen 4"),
    ],
  },


  // ===================================================
  // INOX GT CENTRAL
  // ===================================================

  {
    name: "INOX GT Central Mall",
    city: "Jaipur",

    location: {
      type: "Point",
      coordinates: [
        75.805,
        26.851,
      ],
    },

    screens: [
      mediumScreen("Screen 1"),
      mediumScreen("Screen 2"),
      mediumScreen("Screen 3"),
    ],
  },


  // ===================================================
  // INOX JTM MALL
  // 3 screens / 585 seats documented
  // ===================================================

  {
    name: "INOX JTM Mall",
    city: "Jaipur",

    location: {
      type: "Point",
      coordinates: [
        75.8337605,
        26.8373736,
      ],
    },

    screens: [
      mediumScreen("Screen 1"),
      smallScreen("Screen 2"),
      mediumScreen("Screen 3"),
    ],
  },


  // ===================================================
  // MIRAJ ENTERTAINMENT PARADISE
  // ===================================================

  {
    name: "Miraj Cinemas - Entertainment Paradise",
    city: "Jaipur",

    location: {
      type: "Point",
      coordinates: [
        75.79667,
        26.83745,
      ],
    },

    screens: [
      largeScreen("Screen 1"),
      largeScreen("Screen 2"),
      reclinerScreen("Screen 3"),
    ],
  },


  // ===================================================
  // FIRST CINEMA
  // ===================================================

  {
    name: "First Cinema",
    city: "Jaipur",

    location: {
      type: "Point",
      coordinates: [
        75.79447,
        26.84044,
      ],
    },

    screens: [
      mediumScreen("Screen 1"),
      mediumScreen("Screen 2"),
    ],
  },


  // ===================================================
  // GALAXY CINEMA
  // ===================================================

  {
    name: "Galaxy Cinema Mansarovar",
    city: "Jaipur",

    location: {
      type: "Point",
      coordinates: [
        75.77829,
        26.83386,
      ],
    },

    screens: [
      mediumScreen("Screen 1"),
      mediumScreen("Screen 2"),
    ],
  },


  // ===================================================
  // INOX SUNNY TRADE CENTER
  // ===================================================

  {
    name: "INOX Sunny Trade Center",
    city: "Jaipur",

    location: {
      type: "Point",
      coordinates: [
        75.77717,
        26.96157,
      ],
    },

    screens: [
      mediumScreen("Screen 1"),
      mediumScreen("Screen 2"),
      mediumScreen("Screen 3"),
      mediumScreen("Screen 4"),
    ],
  },


  // ===================================================
  // PVR MALL OF JAIPUR
  // ===================================================

  {
    name: "PVR Mall of Jaipur",
    city: "Jaipur",

    location: {
      type: "Point",
      coordinates: [
        75.75,
        26.91,
      ],
    },

    screens: [
      mediumScreen("Screen 1"),
      mediumScreen("Screen 2"),

      reclinerScreen("Screen 3"),

      mediumScreen("Screen 4"),
      mediumScreen("Screen 5"),
      mediumScreen("Screen 6"),

      smallScreen("Screen 7"),
    ],
  },


  // ===================================================
  // INOX VAIBHAV
  // ===================================================

  {
    name: "INOX Vaibhav",
    city: "Jaipur",

    location: {
      type: "Point",
      coordinates: [
        75.74342,
        26.9127,
      ],
    },

    screens: [
      largeScreen("Screen 1"),
      mediumScreen("Screen 2"),
    ],
  },


  // ===================================================
  // INOX ELEMENTS MALL
  // ===================================================

  {
    name: "INOX Elements Mall",
    city: "Jaipur",

    location: {
      type: "Point",
      coordinates: [
        75.73968,
        26.90597,
      ],
    },

    screens: [
      mediumScreen("Screen 1"),
      smallScreen("Screen 2"),
    ],
  },


  // ===================================================
  // INOX PINK SQUARE
  // 4 screens / 896 seats publicly listed
  // ===================================================

  {
    name: "INOX Pink Square Mall",
    city: "Jaipur",

    location: {
      type: "Point",
      coordinates: [
        75.83625,
        26.90262,
      ],
    },

    screens: [
      mediumScreen("Screen 1"),
      mediumScreen("Screen 2"),
      mediumScreen("Screen 3"),
      mediumScreen("Screen 4"),
    ],
  },


  // ===================================================
  // CINEPOLIS TRITON
  // 4 screens publicly documented
  // ===================================================

  {
    name: "Cinepolis Triton Mega Mall",
    city: "Jaipur",

    location: {
      type: "Point",
      coordinates: [
        75.77136,
        26.94114,
      ],
    },

    screens: [
      mediumScreen("Screen 1"),
      mediumScreen("Screen 2"),
      mediumScreen("Screen 3"),
      mediumScreen("Screen 4"),
    ],
  },


  // ===================================================
  // FUNSTAR
  // ===================================================

  {
    name: "Funstar Cinemas Vidhyadhar Nagar",
    city: "Jaipur",

    location: {
      type: "Point",
      coordinates: [
        75.77857,
        26.96061,
      ],
    },

    screens: [
      mediumScreen("Screen 1"),
      mediumScreen("Screen 2"),
      smallScreen("Screen 3"),
    ],
  },


  // ===================================================
  // CINESTAR
  // ===================================================

  {
    name: "Cinestar Multiplex Vidhyadhar Nagar",
    city: "Jaipur",

    location: {
      type: "Point",
      coordinates: [
        75.78139,
        26.96488,
      ],
    },

    screens: [
      mediumScreen("Screen 1"),
      mediumScreen("Screen 2"),
      smallScreen("Screen 3"),
    ],
  },


  // ===================================================
  // DD CINEMAS
  // ===================================================

  {
    name: "DD Cinemas - Viva City Mall",
    city: "Jaipur",

    location: {
      type: "Point",
      coordinates: [
        75.857,
        26.8024,
      ],
    },

    screens: [
      mediumScreen("Screen 1"),
      mediumScreen("Screen 2"),
    ],
  },


  // ===================================================
  // KOHINOOR
  // ===================================================

  {
    name: "Kohinoor Cinema",
    city: "Jaipur",

    location: {
      type: "Point",
      coordinates: [
        75.82,
        26.82,
      ],
    },

    screens: [
      largeScreen("Screen 1"),
    ],
  },


  // ===================================================
  // GOLD CINEMA
  // ===================================================

  {
    name: "Gold Cinema - City Plaza",
    city: "Jaipur",

    location: {
      type: "Point",
      coordinates: [
        75.79,
        26.93,
      ],
    },

    screens: [
      mediumScreen("Screen 1"),
      mediumScreen("Screen 2"),
    ],
  },
];


// -----------------------------------------------------
// SEED DATABASE
// -----------------------------------------------------

async function seedTheaters() {
  try {
    await mongoose.connect(MONGO_URI);

    console.log("MongoDB connected");

    await Theater.deleteMany({});

    const inserted = await Theater.insertMany(theaters);

    console.log(
      `Successfully inserted ${inserted.length} theaters`
    );

    inserted.forEach((theater) => {
      console.log(
        `${theater.name}: ${theater.screens.length} screens`
      );

      theater.screens.forEach((screen) => {
        console.log(
          `  ${screen.screenName}: ${screen.totalSeats} seats`
        );
      });
    });

    await mongoose.connection.close();

    console.log("MongoDB connection closed");
  } catch (error) {
    console.error("Seeding failed:", error);

    await mongoose.connection.close();

    process.exit(1);
  }
}

seedTheaters();
