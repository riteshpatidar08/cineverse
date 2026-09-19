const mongoose = require("mongoose");
require('dotenv').config();

const City = require("../models/cityModel");
const MONGO_URI = process.env.MONGODB_URI;

// Real Indian cities with exact latitude and longitude
const cities = [
  { cityName: "Jaipur", stateName: "Rajasthan", citylat: 26.9124, cityLong: 75.7873, cityKey: "jaipur_rajasthan", cleanedCityName: "Jaipur" },
  { cityName: "Delhi", stateName: "Delhi", citylat: 28.7041, cityLong: 77.1025, cityKey: "delhi_delhi", cleanedCityName: "Delhi" },
  { cityName: "Mumbai", stateName: "Maharashtra", citylat: 19.0760, cityLong: 72.8777, cityKey: "mumbai_maharashtra", cleanedCityName: "Mumbai" },
  { cityName: "Bangalore", stateName: "Karnataka", citylat: 12.9716, cityLong: 77.5946, cityKey: "bangalore_karnataka", cleanedCityName: "Bangalore" },
  { cityName: "Hyderabad", stateName: "Telangana", citylat: 17.3850, cityLong: 78.4867, cityKey: "hyderabad_telangana", cleanedCityName: "Hyderabad" },
  { cityName: "Chennai", stateName: "Tamil Nadu", citylat: 13.0827, cityLong: 80.2707, cityKey: "chennai_tamilnadu", cleanedCityName: "Chennai" },
  { cityName: "Kolkata", stateName: "West Bengal", citylat: 22.5726, cityLong: 88.3639, cityKey: "kolkata_westbengal", cleanedCityName: "Kolkata" },
  { cityName: "Pune", stateName: "Maharashtra", citylat: 18.5204, cityLong: 73.8567, cityKey: "pune_maharashtra", cleanedCityName: "Pune" },
  { cityName: "Ahmedabad", stateName: "Gujarat", citylat: 23.0225, cityLong: 72.5714, cityKey: "ahmedabad_gujarat", cleanedCityName: "Ahmedabad" },
  { cityName: "Lucknow", stateName: "Uttar Pradesh", citylat: 26.8467, cityLong: 80.9462, cityKey: "lucknow_uttarpradesh", cleanedCityName: "Lucknow" },
  { cityName: "Chandigarh", stateName: "Chandigarh", citylat: 30.7333, cityLong: 76.7794, cityKey: "chandigarh_chandigarh", cleanedCityName: "Chandigarh" },
  { cityName: "Bhopal", stateName: "Madhya Pradesh", citylat: 23.1815, cityLong: 79.9864, cityKey: "bhopal_madhyapradesh", cleanedCityName: "Bhopal" },
  { cityName: "Visakhapatnam", stateName: "Andhra Pradesh", citylat: 17.6869, cityLong: 83.2185, cityKey: "visakhapatnam_andhra", cleanedCityName: "Visakhapatnam" },
  { cityName: "Indore", stateName: "Madhya Pradesh", citylat: 22.7196, cityLong: 75.8577, cityKey: "indore_madhyapradesh", cleanedCityName: "Indore" },
  { cityName: "Kochi", stateName: "Kerala", citylat: 9.9312, cityLong: 76.2673, cityKey: "kochi_kerala", cleanedCityName: "Kochi" },
  { cityName: "Surat", stateName: "Gujarat", citylat: 21.1458, cityLong: 72.8336, cityKey: "surat_gujarat", cleanedCityName: "Surat" },
  { cityName: "Vadodara", stateName: "Gujarat", citylat: 22.3072, cityLong: 73.1812, cityKey: "vadodara_gujarat", cleanedCityName: "Vadodara" },
  { cityName: "Nagpur", stateName: "Maharashtra", citylat: 21.1458, cityLong: 79.0882, cityKey: "nagpur_maharashtra", cleanedCityName: "Nagpur" },
  { cityName: "Jamshedpur", stateName: "Jharkhand", citylat: 22.8046, cityLong: 86.1846, cityKey: "jamshedpur_jharkhand", cleanedCityName: "Jamshedpur" },
  { cityName: "Coimbatore", stateName: "Tamil Nadu", citylat: 11.0026, cityLong: 76.7155, cityKey: "coimbatore_tamilnadu", cleanedCityName: "Coimbatore" },
  { cityName: "Ghaziabad", stateName: "Uttar Pradesh", citylat: 28.6692, cityLong: 77.4538, cityKey: "ghaziabad_uttarpradesh", cleanedCityName: "Ghaziabad" },
  { cityName: "Ludhiana", stateName: "Punjab", citylat: 30.9010, cityLong: 75.8573, cityKey: "ludhiana_punjab", cleanedCityName: "Ludhiana" },
  { cityName: "Kanpur", stateName: "Uttar Pradesh", citylat: 26.4499, cityLong: 80.3319, cityKey: "kanpur_uttarpradesh", cleanedCityName: "Kanpur" },
  { cityName: "Srinagar", stateName: "Jammu and Kashmir", citylat: 34.0837, cityLong: 74.7973, cityKey: "srinagar_jammukashmir", cleanedCityName: "Srinagar" },
  { cityName: "Thiruvananthapuram", stateName: "Kerala", citylat: 8.5241, cityLong: 76.9366, cityKey: "thiruvananthapuram_kerala", cleanedCityName: "Thiruvananthapuram" },
  { cityName: "Ranchi", stateName: "Jharkhand", citylat: 23.3441, cityLong: 85.3096, cityKey: "ranchi_jharkhand", cleanedCityName: "Ranchi" },
  { cityName: "Guwahati", stateName: "Assam", citylat: 26.1445, cityLong: 91.7362, cityKey: "guwahati_assam", cleanedCityName: "Guwahati" },
  { cityName: "Amritsar", stateName: "Punjab", citylat: 31.6340, cityLong: 74.8723, cityKey: "amritsar_punjab", cleanedCityName: "Amritsar" },
  { cityName: "Raipur", stateName: "Chhattisgarh", citylat: 21.2514, cityLong: 81.6296, cityKey: "raipur_chhattisgarh", cleanedCityName: "Raipur" },
  { cityName: "Aurangabad", stateName: "Maharashtra", citylat: 19.8762, cityLong: 75.3433, cityKey: "aurangabad_maharashtra", cleanedCityName: "Aurangabad" },
  { cityName: "Gurgaon", stateName: "Haryana", citylat: 28.4595, cityLong: 77.0266, cityKey: "gurgaon_haryana", cleanedCityName: "Gurgaon" },
  { cityName: "Noida", stateName: "Uttar Pradesh", citylat: 28.5921, cityLong: 77.3713, cityKey: "noida_uttarpradesh", cleanedCityName: "Noida" },
  { cityName: "Nashik", stateName: "Maharashtra", citylat: 19.9975, cityLong: 73.7898, cityKey: "nashik_maharashtra", cleanedCityName: "Nashik" },
  { cityName: "Faridabad", stateName: "Haryana", citylat: 28.4089, cityLong: 77.3178, cityKey: "faridabad_haryana", cleanedCityName: "Faridabad" },
  { cityName: "Meerut", stateName: "Uttar Pradesh", citylat: 28.9845, cityLong: 77.7064, cityKey: "meerut_uttarpradesh", cleanedCityName: "Meerut" },
  { cityName: "Varanasi", stateName: "Uttar Pradesh", citylat: 25.3209, cityLong: 83.0110, cityKey: "varanasi_uttarpradesh", cleanedCityName: "Varanasi" },
  { cityName: "Agra", stateName: "Uttar Pradesh", citylat: 27.1767, cityLong: 78.0081, cityKey: "agra_uttarpradesh", cleanedCityName: "Agra" },
  { cityName: "Thane", stateName: "Maharashtra", citylat: 19.2183, cityLong: 72.9781, cityKey: "thane_maharashtra", cleanedCityName: "Thane" },
  { cityName: "Allahabad", stateName: "Uttar Pradesh", citylat: 25.4358, cityLong: 81.8463, cityKey: "allahabad_uttarpradesh", cleanedCityName: "Allahabad" },
  { cityName: "Tiruchirappalli", stateName: "Tamil Nadu", citylat: 11.0001, cityLong: 79.8611, cityKey: "tiruchirappalli_tamilnadu", cleanedCityName: "Tiruchirappalli" },
  { cityName: "Salem", stateName: "Tamil Nadu", citylat: 11.6643, cityLong: 78.1460, cityKey: "salem_tamilnadu", cleanedCityName: "Salem" },
  { cityName: "Jabalpur", stateName: "Madhya Pradesh", citylat: 23.1815, cityLong: 79.9864, cityKey: "jabalpur_madhyapradesh", cleanedCityName: "Jabalpur" },
  { cityName: "Ujjain", stateName: "Madhya Pradesh", citylat: 23.1815, cityLong: 75.7779, cityKey: "ujjain_madhyapradesh", cleanedCityName: "Ujjain" },
  { cityName: "Mysore", stateName: "Karnataka", citylat: 12.2958, cityLong: 76.6394, cityKey: "mysore_karnataka", cleanedCityName: "Mysore" },
  { cityName: "Mangalore", stateName: "Karnataka", citylat: 12.8658, cityLong: 74.8449, cityKey: "mangalore_karnataka", cleanedCityName: "Mangalore" },
  { cityName: "Belgaum", stateName: "Karnataka", citylat: 15.8604, cityLong: 74.5024, cityKey: "belgaum_karnataka", cleanedCityName: "Belgaum" },
  { cityName: "Hubli", stateName: "Karnataka", citylat: 15.3647, cityLong: 75.1240, cityKey: "hubli_karnataka", cleanedCityName: "Hubli" },
  { cityName: "Davangere", stateName: "Karnataka", citylat: 14.4667, cityLong: 75.9167, cityKey: "davangere_karnataka", cleanedCityName: "Davangere" },
  { cityName: "Erode", stateName: "Tamil Nadu", citylat: 11.3411, cityLong: 77.7172, cityKey: "erode_tamilnadu", cleanedCityName: "Erode" },
  { cityName: "Madurai", stateName: "Tamil Nadu", citylat: 9.9252, cityLong: 78.1198, cityKey: "madurai_tamilnadu", cleanedCityName: "Madurai" },
  { cityName: "Bhubaneswar", stateName: "Odisha", citylat: 20.2961, cityLong: 85.8245, cityKey: "bhubaneswar_odisha", cleanedCityName: "Bhubaneswar" },
  { cityName: "Vijaywada", stateName: "Andhra Pradesh", citylat: 16.5062, cityLong: 80.6480, cityKey: "vijaywada_andhra", cleanedCityName: "Vijaywada" },
  { cityName: "Rajkot", stateName: "Gujarat", citylat: 22.3039, cityLong: 70.8022, cityKey: "rajkot_gujarat", cleanedCityName: "Rajkot" },
  { cityName: "Jamnagar", stateName: "Gujarat", citylat: 22.4707, cityLong: 70.0883, cityKey: "jamnagar_gujarat", cleanedCityName: "Jamnagar" },
  { cityName: "Dhanbad", stateName: "Jharkhand", citylat: 23.7957, cityLong: 86.4304, cityKey: "dhanbad_jharkhand", cleanedCityName: "Dhanbad" },
  { cityName: "Durgapur", stateName: "West Bengal", citylat: 23.8103, cityLong: 87.3118, cityKey: "durgapur_westbengal", cleanedCityName: "Durgapur" },
];

async function seedCities() {
  try {
    console.log("\n==============================");
    console.log("CITY SEEDER STARTED");
    console.log("==============================\n");

    // Connect to MongoDB
    console.log("Connecting to MongoDB...");
    await mongoose.connect(MONGO_URI);
    console.log("MongoDB connected successfully\n");

    // Delete old cities
    console.log("Deleting old cities...");
    const deleteResult = await City.deleteMany({});
    console.log(`Deleted ${deleteResult.deletedCount} old cities\n`);

    // Insert new cities
    console.log(`Inserting ${cities.length} cities...`);
    const result = await City.insertMany(cities);
    console.log(`Successfully seeded ${result.length} cities\n`);

    // Display sample
    console.log("Sample cities seeded:");
    result.slice(0, 10).forEach((city) => {
      console.log(`  ✓ ${city.cityName}, ${city.stateName} (${city.citylat}, ${city.cityLong})`);
    });
    console.log(`  ... and ${result.length - 10} more\n`);

    console.log("==============================");
    console.log("CITY SEEDING COMPLETED");
    console.log("==============================\n");

    process.exit(0);
  } catch (error) {
    console.error("Error during city seeding:", error);
    process.exit(1);
  }
}

// Run seeder
seedCities();
