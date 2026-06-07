import express from 'express';
import db from '../db.js';
import { authenticateAdmin, generateAdminToken, verifyAdminPassword } from '../auth.js';
import { validateAdminLogin, validateGuestCreation } from '../validators.js';
import { sendInviteEmail } from '../email.js';
import { v4 as uuidv4 } from 'uuid';

const router = express.Router();

// Login
router.post('/login', async (req, res) => {
  try {
    const { error, value } = validateAdminLogin(req.body);

    if (error) {
      return res.status(400).json({ error: error.details[0].message });
    }

    if (!verifyAdminPassword(value.password)) {
      return res.status(401).json({ error: 'Invalid password' });
    }

    const token = generateAdminToken();
    res.json({ token });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Login failed' });
  }
});

// Get all RSVPs with filters
router.get('/rsvps', authenticateAdmin, async (req, res) => {
  try {
    const { search, attending, mealPref, page = 1, limit = 10 } = req.query;
    let query = db('rsvps');

    if (search) {
      query = query.where('name', 'like', `%${search}%`).orWhere('email', 'like', `%${search}%`);
    }

    if (attending !== undefined) {
      query = query.where('attending', attending === 'true');
    }

    if (mealPref) {
      query = query.where('meal_preference', mealPref);
    }

    const total = await query.clone().count('* as count').first();
    const rsvps = await query.limit(limit).offset((page - 1) * limit).orderBy('responded_at', 'desc');

    res.json({
      data: rsvps,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total: total.count,
        pages: Math.ceil(total.count / limit),
      },
    });
  } catch (error) {
    console.error('Error fetching RSVPs:', error);
    res.status(500).json({ error: 'Failed to fetch RSVPs' });
  }
});

// Get statistics
router.get('/stats', authenticateAdmin, async (req, res) => {
  try {
    const totalRsvps = await db('rsvps').count('* as count').first();
    const acceptedRsvps = await db('rsvps').where('attending', true).count('* as count').first();
    const declinedRsvps = await db('rsvps').where('attending', false).count('* as count').first();
    const totalGuests = await db('rsvps').sum('adults as adults').sum('children as children').first();
    const mealPreferences = await db('rsvps')
      .select('meal_preference')
      .count('* as count')
      .groupBy('meal_preference');

    res.json({
      totalRsvps: totalRsvps.count,
      accepted: acceptedRsvps.count,
      declined: declinedRsvps.count,
      totalAdults: totalGuests.adults || 0,
      totalChildren: totalGuests.children || 0,
      totalPeople: (totalGuests.adults || 0) + (totalGuests.children || 0),
      mealPreferences,
    });
  } catch (error) {
    console.error('Error fetching stats:', error);
    res.status(500).json({ error: 'Failed to fetch statistics' });
  }
});

// Export RSVPs to CSV
router.get('/export/csv', authenticateAdmin, async (req, res) => {
  try {
    const rsvps = await db('rsvps').orderBy('responded_at', 'desc');

    const headers = ['Name', 'Email', 'Adults', 'Children', 'Meal Preference', 'Attending', 'Message', 'Responded At'];
    const rows = rsvps.map(r => [
      r.name,
      r.email,
      r.adults,
      r.children,
      r.meal_preference,
      r.attending ? 'Yes' : 'No',
      r.message || '',
      r.responded_at,
    ]);

    const csv = [
      headers.join(','),
      ...rows.map(row => row.map(cell => `"${cell}"`).join(',')),
    ].join('\n');

    res.header('Content-Type', 'text/csv');
    res.header('Content-Disposition', 'attachment; filename="rsvps.csv"');
    res.send(csv);
  } catch (error) {
    console.error('Error exporting CSV:', error);
    res.status(500).json({ error: 'Failed to export CSV' });
  }
});

// Add new guest
router.post('/guests', authenticateAdmin, async (req, res) => {
  try {
    const { error, value } = validateGuestCreation(req.body);

    if (error) {
      return res.status(400).json({ error: error.details[0].message });
    }

    const guestId = uuidv4();
    await db('guests').insert({
      id: guestId,
      name: value.name,
      email: value.email,
      created_at: db.fn.now(),
    });

    const event = await db('event').first();
    const inviteLink = `${process.env.FRONTEND_URL}/invite/${guestId}`;

    // Send invite email
    if (event) {
      await sendInviteEmail(value.email, value.name, inviteLink, event);
    }

    res.json({
      id: guestId,
      name: value.name,
      email: value.email,
      inviteLink,
    });
  } catch (error) {
    console.error('Error adding guest:', error);
    res.status(500).json({ error: 'Failed to add guest' });
  }
});

// Delete guest
router.delete('/guests/:id', authenticateAdmin, async (req, res) => {
  try {
    const { id } = req.params;

    // Delete associated RSVPs
    await db('rsvps').where('guest_id', id).delete();

    // Delete guest
    await db('guests').where('id', id).delete();

    res.json({ success: true, message: 'Guest deleted' });
  } catch (error) {
    console.error('Error deleting guest:', error);
    res.status(500).json({ error: 'Failed to delete guest' });
  }
});

// Regenerate invite link
router.post('/guests/:id/regenerate', authenticateAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    const guest = await db('guests').where('id', id).first();

    if (!guest) {
      return res.status(404).json({ error: 'Guest not found' });
    }

    const inviteLink = `${process.env.FRONTEND_URL}/invite/${id}`;
    const event = await db('event').first();

    // Resend invite email
    if (event) {
      await sendInviteEmail(guest.email, guest.name, inviteLink, event);
    }

    res.json({
      id: guest.id,
      name: guest.name,
      email: guest.email,
      inviteLink,
    });
  } catch (error) {
    console.error('Error regenerating invite:', error);
    res.status(500).json({ error: 'Failed to regenerate invite' });
  }
});

export default router;
