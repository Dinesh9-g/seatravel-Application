// backend/server.js
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
require('dotenv').config();

const { db, initDatabase } = require('./database');
const voyagesRoutes = require('./routes/voyages');
const bookingsRoutes = require('./routes/bookings');
const reviewsRoutes = require('./routes/reviews');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({
  origin: ['http://localhost:3000', 'http://localhost:3001', 'http://localhost:5000'],
  credentials: true
}));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Initialize database
initDatabase().catch((error) => {
  console.error('Database initialization failed:', error);
  process.exit(1);
});

// Routes
app.use('/api/voyages', voyagesRoutes);
app.use('/api/bookings', bookingsRoutes);
app.use('/api/reviews', reviewsRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'Server running', timestamp: new Date().toISOString() });
});

// Seed initial data (optional - only run once)
app.post('/api/seed', async (req, res) => {
  try {
    // Check if data already exists
    const count = await db.prepare('SELECT COUNT(*) as count FROM voyages').get();
    
    if (count.count === 0) {
      // Insert sample voyages
      const voyages = [
        {
          title: 'Caribbean Paradise',
          description: '7-night cruise visiting exotic Caribbean islands',
          departure: '2025-12-15',
          duration: '7 nights',
          ports: JSON.stringify(['Miami', 'Nassau', 'St. Thomas', 'San Juan']),
          basePrice: 1299,
          image: 'yacht-sea-sunset.jpg'
        },
        {
          title: 'Mediterranean Escape',
          description: '10-night luxury cruise through Mediterranean coast',
          departure: '2025-06-20',
          duration: '10 nights',
          ports: JSON.stringify(['Barcelona', 'Rome', 'Athens', 'Istanbul', 'Venice']),
          basePrice: 1899,
          image: 'blue-villa-beautiful-sea-hotel.jpg'
        },
        {
          title: 'Alaska Wilderness',
          description: '5-night adventure exploring glaciers and wildlife',
          departure: '2025-07-10',
          duration: '5 nights',
          ports: JSON.stringify(['Juneau', 'Ketchikan', 'Glacier Bay', 'Sitka']),
          basePrice: 1599,
          image: 'luxurious-cruise-ship.jpg'
        },
        {
          title: 'Asia Pacific Adventure',
          description: '14-night exploration of tropical islands and exotic ports',
          departure: '2025-09-05',
          duration: '14 nights',
          ports: JSON.stringify(['Bangkok', 'Phuket', 'Singapore', 'Bali', 'Hanoi']),
          basePrice: 2499,
          image: 'arborek-island-atoll.jpg'
        }
      ];

      for (const voyage of voyages) {
        const insertVoyage = db.prepare(`
          INSERT INTO voyages (title, description, departure, duration, ports, basePrice, image)
          VALUES (?, ?, ?, ?, ?, ?, ?)
        `);
        const result = await insertVoyage.run(
          voyage.title, 
          voyage.description, 
          voyage.departure, 
          voyage.duration, 
          voyage.ports, 
          voyage.basePrice, 
          voyage.image
        );

        const voyageId = result.lastInsertRowid;

        // Insert cabins for each voyage
        const cabins = [
          { type: 'Interior', price: voyage.basePrice, available: 15, maxOccupancy: 2 },
          { type: 'Ocean View', price: voyage.basePrice + 300, available: 8, maxOccupancy: 2 },
          { type: 'Balcony', price: voyage.basePrice + 700, available: 5, maxOccupancy: 4 },
          { type: 'Suite', price: voyage.basePrice + 1700, available: 2, maxOccupancy: 4 }
        ];

        for (const cabin of cabins) {
          await db.prepare(`
            INSERT INTO cabins (voyageId, type, price, available, maxOccupancy)
            VALUES (?, ?, ?, ?, ?)
          `).run(voyageId, cabin.type, cabin.price, cabin.available, cabin.maxOccupancy);
        }
      }

      res.json({ message: 'Database seeded successfully with 4 voyages and cabins' });
    } else {
      res.json({ message: 'Database already contains data' });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Internal server error', message: err.message });
});

// Start server
app.listen(PORT, () => {
  console.log(`✅ Backend server running on http://localhost:${PORT}`);
  console.log(`📊 API endpoints available at http://localhost:${PORT}/api`);
  console.log(`💾 Database: ${process.env.DB_NAME || 'seatravel'} on MySQL`);
  console.log(`\n📝 Available routes:`);
  console.log(`   GET  /api/voyages - Get all voyages`);
  console.log(`   GET  /api/voyages/:id - Get voyage details`);
  console.log(`   GET  /api/bookings - Get all bookings`);
  console.log(`   GET  /api/bookings/user/:userId - Get user bookings`);
  console.log(`   GET  /api/reviews/voyage/:voyageId - Get voyage reviews`);
  console.log(`   POST /api/seed - Initialize database with sample data`);
});
