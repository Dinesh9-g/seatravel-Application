const express = require("express");
const cors = require("cors");
const bcrypt = require("bcryptjs");
require("dotenv").config();

const app = express();
const db = require("./database");

app.use(cors());
app.use(express.json());

async function ensureUserTable() {
  await db.query(`
    CREATE TABLE IF NOT EXISTS users (
      id SERIAL PRIMARY KEY,
      email TEXT UNIQUE NOT NULL,
      password TEXT NOT NULL,
      name TEXT,
      phone TEXT,
      created_at TIMESTAMP DEFAULT NOW()
    );
  `);
}

// ---------------- TEST ROUTE ----------------
app.get("/test-db", async (req, res) => {
  try {
    const result = await db.query("SELECT NOW()");
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ---------------- SEED ROUTE ----------------
app.post("/api/seed", async (req, res) => {
  try {
    const countResult = await db.query("SELECT COUNT(*) FROM voyages");
    const count = parseInt(countResult.rows[0].count, 10);

    if (count > 0) {
      return res.json({ message: "Database already contains data" });
    }

    const voyages = [
      {
        title: "Caribbean Paradise",
        description: "7-night cruise visiting exotic Caribbean islands",
        departure: "2025-12-15",
        duration: "7 nights",
        ports: ["Miami", "Nassau", "St. Thomas", "San Juan"],
        basePrice: 1299,
        image: "yacht-sea-sunset.jpg",
      },
      {
        title: "Mediterranean Escape",
        description: "10-night luxury cruise through Mediterranean coast",
        departure: "2025-06-20",
        duration: "10 nights",
        ports: ["Barcelona", "Rome", "Athens", "Istanbul", "Venice"],
        basePrice: 1899,
        image: "blue-villa-beautiful-sea-hotel.jpg",
      },
    ];

    for (const voyage of voyages) {
      const result = await db.query(
        `INSERT INTO voyages 
        (title, description, departure, duration, ports, baseprice, image)
        VALUES ($1,$2,$3,$4,$5,$6,$7)
        RETURNING id`,
        [
          voyage.title,
          voyage.description,
          voyage.departure,
          voyage.duration,
          JSON.stringify(voyage.ports),
          voyage.basePrice,
          voyage.image,
        ]
      );

      const voyageId = result.rows[0].id;

      const cabins = [
        { type: "Interior", price: voyage.basePrice, available: 15, max: 2 },
        { type: "Ocean View", price: voyage.basePrice + 300, available: 8, max: 2 },
        { type: "Balcony", price: voyage.basePrice + 700, available: 5, max: 4 },
        { type: "Suite", price: voyage.basePrice + 1700, available: 2, max: 4 },
      ];

      for (const cabin of cabins) {
        await db.query(
          `INSERT INTO cabins 
          (voyageid, type, price, available, maxoccupancy)
          VALUES ($1,$2,$3,$4,$5)`,
          [voyageId, cabin.type, cabin.price, cabin.available, cabin.max]
        );
      }
    }

    res.json({ message: "Database seeded successfully 🚀" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

// ---------------- GET ALL VOYAGES ----------------
app.get("/api/voyages", async (req, res) => {
  try {
    const result = await db.query("SELECT * FROM voyages ORDER BY id");
    const voyages = result.rows.map((voyage) => ({
      ...voyage,
      ports: voyage.ports ? JSON.parse(voyage.ports) : [],
    }));
    res.json(voyages);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

// ---------------- GET CABINS FOR A VOYAGE ----------------
app.get("/api/voyages/:id/cabins", async (req, res) => {
  const { id } = req.params;
  try {
    const voyageResult = await db.query("SELECT * FROM voyages WHERE id = $1", [id]);
    if (voyageResult.rows.length === 0) {
      return res.status(404).json({ error: "Voyage not found" });
    }

    const cabinsResult = await db.query("SELECT * FROM cabins WHERE voyageid = $1 ORDER BY id", [id]);
    res.json(cabinsResult.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

// ---------------- USER REGISTRATION ----------------
app.post("/api/users/register", async (req, res) => {
  const { email, password, name, phone } = req.body;
  if (!email || !password) {
    return res.status(400).json({ error: "Email and password are required" });
  }

  try {
    const existing = await db.query("SELECT id FROM users WHERE email = $1", [email]);
    if (existing.rows.length > 0) {
      return res.status(409).json({ error: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const insert = await db.query(
      `INSERT INTO users (email, password, name, phone)
       VALUES ($1, $2, $3, $4)
       RETURNING id, email, name, phone, created_at`,
      [email, hashedPassword, name || null, phone || null]
    );

    res.status(201).json({ user: insert.rows[0] });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

// ---------------- USER LOGIN ----------------
app.post("/api/users/login", async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ error: "Email and password are required" });
  }

  try {
    const result = await db.query("SELECT * FROM users WHERE email = $1", [email]);
    const user = result.rows[0];
    if (!user) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    const valid = await bcrypt.compare(password, user.password);
    if (!valid) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    const { password: pwd, ...userData } = user;
    res.json({ user: userData });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

// ---------------- START SERVER ----------------
const PORT = process.env.PORT || 5000;

// Start server only after DB connection is verified
if (typeof db.testConnection === "function") {
  db
    .testConnection()
    .then(() => ensureUserTable())
    .then(() => {
      app.listen(PORT, () => {
        console.log(`✅ Server running on http://localhost:${PORT}`);
      });
    })
    .catch((err) => {
      console.error("❌ Failed to connect to DB. Server not started.");
      console.error(err);
      process.exit(1);
    });
} else {
  // Fallback: create user table and start server immediately if testConnection isn't available
  ensureUserTable()
    .then(() => {
      app.listen(PORT, () => {
        console.log(`✅ Server running on http://localhost:${PORT}`);
      });
    })
    .catch((err) => {
      console.error("❌ Failed to initialize schema. Server not started.");
      console.error(err);
      process.exit(1);
    });
}