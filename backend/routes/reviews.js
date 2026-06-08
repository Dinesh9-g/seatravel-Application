// backend/routes/reviews.js
const express = require('express');
const router = express.Router();
const { db } = require('../database');

// Get reviews for voyage
router.get('/voyage/:voyageId', async (req, res) => {
  try {
    const reviews = await db.prepare(`
      SELECT r.*, u.name
      FROM reviews r
      JOIN users u ON r.userId = u.id
      WHERE r.voyageId = ?
      ORDER BY r.createdAt DESC
    `).all(req.params.voyageId);

    const avgRating = await db.prepare(`
      SELECT AVG(rating) as avgRating, COUNT(*) as totalReviews
      FROM reviews
      WHERE voyageId = ?
    `).get(req.params.voyageId);

    res.json({ reviews, avgRating });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Create review
router.post('/', async (req, res) => {
  try {
    const { bookingId, userId, voyageId, rating, comment } = req.body;
    
    const result = await db.prepare(`
      INSERT INTO reviews (bookingId, userId, voyageId, rating, comment)
      VALUES (?, ?, ?, ?, ?)
    `).run(bookingId, userId, voyageId, rating, comment);

    res.json({ id: result.lastInsertRowid, message: 'Review created successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update review
router.put('/:id', async (req, res) => {
  try {
    const { rating, comment } = req.body;
    
    await db.prepare('UPDATE reviews SET rating = ?, comment = ? WHERE id = ?').run(rating, comment, req.params.id);

    res.json({ message: 'Review updated successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Delete review
router.delete('/:id', async (req, res) => {
  try {
    await db.prepare('DELETE FROM reviews WHERE id = ?').run(req.params.id);
    res.json({ message: 'Review deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
