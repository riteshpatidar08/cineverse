const mongoose = require('mongoose');
const Movie = require('../models/movieModel.js');
const dotenv = require('dotenv');
const config = require('../config/config.js');
dotenv.config();

const MONGO_URI = config.db.mongodbURI || process.env.MONGODB_URI;

const movies = [
  {
    title: 'Pushpa 2: The Rule',
    poster: 'https://images.unsplash.com/photo-1536440136628-849c177e76a1?auto=format&fit=crop&q=80&w=800',
    duration: 200,
    description: 'The intense clash continues between Pushpa Raj and Bhanwar Singh Shekhawat as Pushpa expands his red sandalwood empire.',
    genres: ['Action', 'Crime', 'Drama'],
    censorRating: 'UA16+',
    releaseDate: new Date('2024-12-05'),
    isActive: true,
  },
  {
    title: 'Stree 2: Sarkate Ka Aatank',
    poster: 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?auto=format&fit=crop&q=80&w=800',
    duration: 147,
    description: 'The town of Chanderi is haunted once again by a decapitated headless monster. Vicky and his gang reunite with Stree to save the town.',
    genres: ['Comedy', 'Horror'],
    censorRating: 'UA',
    releaseDate: new Date('2024-08-15'),
    isActive: true,
  },
  {
    title: 'Bhool Bhulaiyaa 3',
    poster: 'https://images.unsplash.com/photo-1579783902614-a3fb3927b675?auto=format&fit=crop&q=80&w=800',
    duration: 158,
    description: 'Rooh Baba travels to Raktaghat in West Bengal where he encounters two menacing spirits claiming to be Manjulika.',
    genres: ['Comedy', 'Horror'],
    censorRating: 'UA',
    releaseDate: new Date('2024-11-01'),
    isActive: true,
  },
  {
    title: 'Singham Again',
    poster: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&q=80&w=800',
    duration: 144,
    description: 'DCP Bajirao Singham leads the Cop Universe team on a high-stakes cross-border rescue mission inspired by the epic Ramayana.',
    genres: ['Action', 'Drama'],
    censorRating: 'UA',
    releaseDate: new Date('2024-11-01'),
    isActive: true,
  },
  {
    title: 'Devara: Part 1',
    poster: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&q=80&w=800',
    duration: 177,
    description: 'An epic action saga set along treacherous coastal waters, detailing a fearless savior defending his people against sea pirates.',
    genres: ['Action', 'Drama', 'Thriller'],
    censorRating: 'UA',
    releaseDate: new Date('2024-09-27'),
    isActive: true,
  },
  {
    title: 'Gladiator II',
    poster: 'https://images.unsplash.com/photo-1517604931442-7e0c8ed2963c?auto=format&fit=crop&q=80&w=800',
    duration: 148,
    description: 'Years after Maximus’ death, Lucius enters the Colosseum after his home is conquered by tyrannical Roman emperors.',
    genres: ['Action', 'Adventure', 'Drama'],
    censorRating: 'A',
    releaseDate: new Date('2024-11-15'),
    isActive: true,
  },
  {
    title: 'Mufasa: The Lion King',
    poster: 'https://images.unsplash.com/photo-1542204165-65bf26472b9b?auto=format&fit=crop&q=80&w=800',
    duration: 118,
    description: 'Rafiki recounts the story of Mufasa’s rise from an orphaned cub to the beloved King of the Pride Lands alongside Taka.',
    genres: ['Animation', 'Adventure', 'Drama'],
    censorRating: 'U',
    releaseDate: new Date('2024-12-20'),
    isActive: true,
  },
  {
    title: 'Wicked',
    poster: 'https://images.unsplash.com/photo-1511512578047-dfb367046420?auto=format&fit=crop&q=80&w=800',
    duration: 160,
    description: 'The untold story of the Witches of Oz exploring the unlikely friendship between Elphaba and Glinda before Dorothy’s arrival.',
    genres: ['Fantasy', 'Musical', 'Romance'],
    censorRating: 'U',
    releaseDate: new Date('2024-11-22'),
    isActive: true,
  },
  {
    title: 'Moana 2',
    poster: 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&q=80&w=800',
    duration: 100,
    description: 'Moana reunites with Maui for an expansive new voyage across the far seas of Oceania after receiving a call from her ancestors.',
    genres: ['Animation', 'Adventure', 'Comedy'],
    censorRating: 'U',
    releaseDate: new Date('2024-11-27'),
    isActive: true,
  },
  {
    title: 'Venom: The Last Dance',
    poster: 'https://cdn.district.in/movies-assets/images/cinema/image-(29)-598ac6b0-6a24-11f1-8579-1756095b1930.jpg',
    duration: 109,
    description: 'Eddie Brock and Venom are hunted by both of their home worlds, forcing them into a devastating final stand.',
    genres: ['Action', 'Sci-Fi'],
    censorRating: 'UA13+',
    releaseDate: new Date('2024-10-25'),
    isActive: true,
  },
  {
    title: 'Kanguva',
    poster: 'https://cdn.district.in/movies-assets/images/cinema/toxiv%3Dc-8340c900-9c6f-11f1-97d4-73a32236137e.jpg',
    duration: 154,
    description: 'A warrior’s struggle 500 years ago connects mysteriously to a bounty hunter’s futuristic quest in the modern era.',
    genres: ['Action', 'Fantasy'],
    censorRating: 'UA16+',
    releaseDate: new Date('2024-11-14'),
    isActive: true,
  },
];

const seedMovies = async () => {
  try {
    console.log('Connecting to MongoDB...');
    await mongoose.connect(MONGO_URI);
    console.log('MongoDB connected successfully.');

    await Movie.deleteMany({});
    console.log('Cleared existing movies from collection.');

    const insertedMovies = await Movie.insertMany(movies);
    console.log(`Successfully seeded ${insertedMovies.length} real BookMyShow & District movies!`);

    await mongoose.connection.close();
    console.log('MongoDB connection closed.');
  } catch (error) {
    console.error('Error seeding movies:', error);
    if (mongoose.connection.readyState !== 0) {
      await mongoose.connection.close();
    }
    process.exit(1);
  }
};

seedMovies();
