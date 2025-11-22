import { seedPorpoiseData } from './server/porpoise-seed';

async function main() {
  try {
    console.log('Starting Porpoise v2 data seeding...\n');
    const result = await seedPorpoiseData();
    console.log('\n✅ Seeding complete!');
    console.log(JSON.stringify(result, null, 2));
    process.exit(0);
  } catch (error) {
    console.error('❌ Seeding failed:', error);
    process.exit(1);
  }
}

main();
