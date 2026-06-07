import dotenv from 'dotenv';
import db from '../src/db.js';

dotenv.config();

const resetDatabase = async () => {
  try {
    console.log('🔄 Resetting database...');

    // Drop tables in order
    await db.schema.dropTableIfExists('rsvps');
    await db.schema.dropTableIfExists('guests');
    await db.schema.dropTableIfExists('event');

    console.log('✅ Tables dropped');

    // Re-run migrations and seed
    const { default: migrate } = await import('./migrate.js');
  } catch (error) {
    console.error('❌ Reset error:', error);
    process.exit(1);
  }
};

resetDatabase();
