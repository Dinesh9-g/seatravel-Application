// backend/routes/voyages.js
const express = require('express');
const router = express.Router();
const { db } = require('../database');

// Get all voyages
router.get('/', async (req, res) => {
  try {
    const voyages = await db.prepare(`
      SELECT v.*, 
             GROUP_CONCAT(c.id || ':' || c.type || ':' || c.price || ':' || c.available || ':' || c.maxOccupancy, '|') as cabinsData
      FROM voyages v
      LEFT JOIN cabins c ON v.id = c.voyageId
      GROUP BY v.id
    `).all();

    const formattedVoyages = voyages.map(voyage => ({
      ...voyage,
      ports: JSON.parse(voyage.ports || '[]'),
      cabins: voyage.cabinsData ? voyage.cabinsData.split('|').map(cabin => {
        const [id, type, price, available, maxOccupancy] = cabin.split(':');
        return { id: parseInt(id), type, price: parseFloat(price), available: parseInt(available), maxOccupancy: parseInt(maxOccupancy) };
      }) : []
    }));

    res.json(formattedVoyages);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get single voyage
router.get('/:id', async (req, res) => {
  try {
    const voyage = await db.prepare('SELECT * FROM voyages WHERE id = ?').get(req.params.id);
    const cabins = await db.prepare('SELECT * FROM cabins WHERE voyageId = ?').all(req.params.id);
    
    if (!voyage) {
      return res.status(404).json({ error: 'Voyage not found' });
    }

    res.json({
      ...voyage,
      ports: JSON.parse(voyage.ports || '[]'),
      cabins: cabins
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Create voyage
router.post('/', async (req, res) => {
  try {
    const { title, description, departure, duration, ports, basePrice, image } = req.body;
    
    const result = await db.prepare(`
      INSERT INTO voyages (title, description, departure, duration, ports, basePrice, image)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `).run(title, description, departure, duration, JSON.stringify(ports), basePrice, image);

    res.json({ id: result.lastInsertRowid, message: 'Voyage created successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update voyage
router.put('/:id', async (req, res) => {
  try {
    const { title, description, departure, duration, ports, basePrice, image } = req.body;
    
    await db.prepare(`
      UPDATE voyages 
      SET title = ?, description = ?, departure = ?, duration = ?, ports = ?, basePrice = ?, image = ?
      WHERE id = ?
    `).run(title, description, departure, duration, JSON.stringify(ports), basePrice, image, req.params.id);

    res.json({ message: 'Voyage updated successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Delete voyage
router.delete('/:id', async (req, res) => {
  try {
    await db.prepare('DELETE FROM voyages WHERE id = ?').run(req.params.id);
    res.json({ message: 'Voyage deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
