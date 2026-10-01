const { execSync } = require('child_process');
const path = require('path');

const seeders = [
  'movieSeed.js',
  'citySeed.js',
  'theatreSeed.js',
  'screenSeed.js',
  'showSeed.js',
  'showSeatSeed.js',
];

console.log('====================================');
console.log('STARTING MASTER SEED PROCESS');
console.log('====================================\n');

for (const seeder of seeders) {
  const filePath = path.join(__dirname, seeder);
  console.log(`\n------------------------------------`);
  console.log(`Running: ${seeder}`);
  console.log(`------------------------------------`);
  try {
    execSync(`node "${filePath}"`, { stdio: 'inherit' });
  } catch (error) {
    console.error(`Failed executing ${seeder}:`, error.message);
    process.exit(1);
  }
}

console.log('\n====================================');
console.log('ALL SEEDERS COMPLETED SUCCESSFULLY');
console.log('====================================');
