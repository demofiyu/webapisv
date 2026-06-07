import dotenv from 'dotenv';
import db from '../src/db.js';
import { v4 as uuidv4 } from 'uuid';

dotenv.config();

const seedDatabase = async () => {
  try {
    console.log('🌱 Seeding database...');

    // Clear existing data
    await db('rsvps').del();
    await db('guests').del();
    await db('event').del();

    // Seed event
    const eventData = {
      name: 'Sarah & John Wedding Reception',
      description: 'Join us for an evening of celebration, food, and dancing!',
      date: '2024-08-15',
      time: '18:00',
      location: '123 Grand Ballroom, Downtown, City',
      mapLink: 'https://maps.google.com',
      dressCode: 'Black Tie Optional',
    };

    await db('event').insert(eventData);
    console.log('✅ Event seeded');

    // Seed sample guests
    const guests = [
      { name: 'Alice Johnson', email: 'alice@example.com' },
      { name: 'Bob Smith', email: 'bob@example.com' },
      { name: 'Carol Williams', email: 'carol@example.com' },
      { name: 'David Brown', email: 'david@example.com' },
      { name: 'Eve Davis', email: 'eve@example.com' },
      { name: 'Frank Miller', email: 'frank@example.com' },
      { name: 'Grace Lee', email: 'grace@example.com' },
      { name: 'Henry Wilson', email: 'henry@example.com' },
      { name: 'Ivy Martin', email: 'ivy@example.com' },
      { name: 'Jack Taylor', email: 'jack@example.com' },
    ];

    const guestIds = [];
    for (const guest of guests) {
      const id = uuidv4();
      await db('guests').insert({
        id,
        name: guest.name,
        email: guest.email,
      });
      guestIds.push(id);
    }

    console.log(`✅ Seeded ${guests.length} guests`);

    // Seed some RSVPs
    const rsvpData = [
      {
        guest_id: guestIds[0],
        name: 'Alice Johnson',
        email: 'alice@example.com',
        adults: 2,
        children: 1,
        meal_preference: 'vegetarian',
        attending: true,
        message: 'We are so excited!',
      },
      {
        guest_id: guestIds[1],
        name: 'Bob Smith',
        email: 'bob@example.com',
        adults: 1,
        children: 0,
        meal_preference: 'non-vegetarian',
        attending: true,
        message: '',
      },
      {
        guest_id: guestIds[2],
        name: 'Carol Williams',
        email: 'carol@example.com',
        adults: 2,
        children: 2,
        meal_preference: 'gluten-free',
        attending: false,
        message: 'Unfortunately cannot make it due to prior commitment',
      },
    ];

    for (const rsvp of rsvpData) {
      await db('rsvps').insert({
        ...rsvp,
        responded_at: db.fn.now(),
      });
    }

    console.log('✅ Seeded sample RSVPs');
    console.log('\n🎉 Database seeded successfully!');
    console.log(`\n📋 Sample guest invite links:`);
    guestIds.slice(0, 3).forEach((id, index) => {
      console.log(`   ${guests[index].name}: ${process.env.FRONTEND_URL || 'http://localhost:5173'}/invite/${id}`);
    });
    console.log(`\n👤 Admin credentials:`);
    console.log(`   Password: admin123`);

    process.exit(0);
  } catch (error) {
    console.error('❌ Seed error:', error);
    process.exit(1);
  }
};

seedDatabase();
