// backend/routes/bookings.js
const express = require('express');
const router = express.Router();
const { db } = require('../database');

// Get all bookings
router.get('/', async (req, res) => {
  try {
    const bookings = await db.prepare(`
      SELECT b.*, u.email, u.name, v.title as voyageName
      FROM bookings b
      JOIN users u ON b.userId = u.id
      JOIN voyages v ON b.voyageId = v.id
      ORDER BY b.createdAt DESC
    `).all();

    res.json(bookings);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get bookings for user
router.get('/user/:userId', async (req, res) => {
  try {
    const bookings = await db.prepare(`
      SELECT b.*, v.title as voyageName
      FROM bookings b
      JOIN voyages v ON b.voyageId = v.id
      WHERE b.userId = ?
      ORDER BY b.createdAt DESC
    `).all(req.params.userId);

    res.json(bookings);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Create booking
router.post('/', async (req, res) => {
  try {
    const { userId, voyageId, cabinId, cabinType, passengerCount, totalPrice, paymentMethod } = req.body;
    
    const result = await db.prepare(`
      INSERT INTO bookings (userId, voyageId, cabinId, cabinType, passengerCount, totalPrice, paymentMethod, status)
      VALUES (?, ?, ?, ?, ?, ?, ?, 'Confirmed')
    `).run(userId, voyageId, cabinId, cabinType, passengerCount, totalPrice, paymentMethod);

    // Update cabin availability
    await db.prepare('UPDATE cabins SET available = available - 1 WHERE id = ?').run(cabinId);

    res.json({ id: result.lastInsertRowid, message: 'Booking created successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update booking status
router.put('/:id', async (req, res) => {
  try {
    const { status } = req.body;
    
    await db.prepare('UPDATE bookings SET status = ? WHERE id = ?').run(status, req.params.id);

    res.json({ message: 'Booking updated successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Cancel booking
router.delete('/:id', async (req, res) => {
  try {
    const booking = await db.prepare('SELECT cabinId FROM bookings WHERE id = ?').get(req.params.id);
    
    if (booking) {
      // Restore cabin availability
      await db.prepare('UPDATE cabins SET available = available + 1 WHERE id = ?').run(booking.cabinId);
    }

    await db.prepare('DELETE FROM bookings WHERE id = ?').run(req.params.id);
    res.json({ message: 'Booking cancelled successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
