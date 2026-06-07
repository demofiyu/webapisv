import dotenv from 'dotenv';
import db from '../src/db.js';

dotenv.config();

const runMigrations = async () => {
  try {
    console.log('🔄 Running migrations...');

    // Create event table
    const hasEventTable = await db.schema.hasTable('event');
    if (!hasEventTable) {
      await db.schema.createTable('event', (table) => {
        table.increments('id').primary();
        table.string('name', 255).notNullable();
        table.text('description');
        table.date('date').notNullable();
        table.time('time').notNullable();
        table.string('location', 255).notNullable();
        table.string('mapLink', 500);
        table.string('dressCode', 255);
        table.timestamps(true, true);
      });
      console.log('✅ Created event table');
    }

    // Create guests table
    const hasGuestsTable = await db.schema.hasTable('guests');
    if (!hasGuestsTable) {
      await db.schema.createTable('guests', (table) => {
        table.string('id').primary();
        table.string('name', 255).notNullable();
        table.string('email', 255).notNullable();
        table.timestamps(true, true);
      });
      console.log('✅ Created guests table');
    }

    // Create rsvps table
    const hasRsvpsTable = await db.schema.hasTable('rsvps');
    if (!hasRsvpsTable) {
      await db.schema.createTable('rsvps', (table) => {
        table.increments('id').primary();
        table.string('guest_id').notNullable().references('id').inTable('guests');
        table.string('name', 255).notNullable();
        table.string('email', 255).notNullable();
        table.integer('adults').notNullable().defaultTo(1);
        table.integer('children').notNullable().defaultTo(0);
        table.enum('meal_preference', ['vegetarian', 'vegan', 'non-vegetarian', 'gluten-free']).notNullable();
        table.boolean('attending').notNullable();
        table.text('message');
        table.timestamp('responded_at');
        table.timestamps(true, true);
      });
      console.log('✅ Created rsvps table');
    }

    console.log('✅ Migrations completed successfully');
    process.exit(0);
  } catch (error) {
    console.error('❌ Migration error:', error);
    process.exit(1);
  }
};

runMigrations();
