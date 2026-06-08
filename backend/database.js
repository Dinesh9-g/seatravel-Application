// backend/database.js
const mysql = require('mysql2/promise');

const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  port: Number(process.env.DB_PORT || 3306),
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || 'root',
  database: process.env.DB_NAME || 'seatravel',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

const db = {
  prepare(sql) {
    const normalize = (params) => (params.length > 1 ? params : params[0] ?? []);

    return {
      async all(...params) {
        const [rows] = await pool.execute(sql, normalize(params));
        return rows;
      },
      async get(...params) {
        const rows = await this.all(...params);
        return rows[0];
      },
      async run(...params) {
        const [result] = await pool.execute(sql, normalize(params));
        return {
          lastInsertRowid: result.insertId,
          changes: result.affectedRows,
          result,
        };
      },
    };
  },
  async exec(sql) {
    await pool.query(sql);
  },
};

const initDatabase = async () => {
  const databaseName = process.env.DB_NAME || 'seatravel';
  await pool.query(`CREATE DATABASE IF NOT EXISTS \`${databaseName}\``);
  await pool.query(`USE \`${databaseName}\``);

  await db.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id INT AUTO_INCREMENT PRIMARY KEY,
      email VARCHAR(255) NOT NULL UNIQUE,
      password VARCHAR(255) NOT NULL,
      name VARCHAR(255) NOT NULL,
      phone VARCHAR(50) NULL,
      createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    ) ENGINE=InnoDB
  `);

  await db.exec(`
    CREATE TABLE IF NOT EXISTS voyages (
      id INT AUTO_INCREMENT PRIMARY KEY,
      title VARCHAR(255) NOT NULL,
      description TEXT NULL,
      departure VARCHAR(100) NOT NULL,
      duration VARCHAR(100) NOT NULL,
      ports TEXT NOT NULL,
      basePrice DECIMAL(10,2) NOT NULL,
      image VARCHAR(255) NULL,
      createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    ) ENGINE=InnoDB
  `);

  await db.exec(`
    CREATE TABLE IF NOT EXISTS cabins (
      id INT AUTO_INCREMENT PRIMARY KEY,
      voyageId INT NOT NULL,
      type VARCHAR(100) NOT NULL,
      price DECIMAL(10,2) NOT NULL,
      available INT NOT NULL,
      maxOccupancy INT NOT NULL,
      FOREIGN KEY (voyageId) REFERENCES voyages(id) ON DELETE CASCADE
    ) ENGINE=InnoDB
  `);

  await db.exec(`
    CREATE TABLE IF NOT EXISTS bookings (
      id INT AUTO_INCREMENT PRIMARY KEY,
      userId INT NOT NULL,
      voyageId INT NOT NULL,
      cabinId INT NOT NULL,
      cabinType VARCHAR(100) NOT NULL,
      passengerCount INT NOT NULL,
      totalPrice DECIMAL(10,2) NOT NULL,
      status VARCHAR(50) DEFAULT 'Confirmed',
      paymentMethod VARCHAR(100) NULL,
      bookingDate TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (userId) REFERENCES users(id) ON DELETE CASCADE,
      FOREIGN KEY (voyageId) REFERENCES voyages(id) ON DELETE CASCADE,
      FOREIGN KEY (cabinId) REFERENCES cabins(id) ON DELETE CASCADE
    ) ENGINE=InnoDB
  `);

  await db.exec(`
    CREATE TABLE IF NOT EXISTS reviews (
      id INT AUTO_INCREMENT PRIMARY KEY,
      bookingId INT NOT NULL,
      userId INT NOT NULL,
      voyageId INT NOT NULL,
      rating INT NOT NULL CHECK (rating >= 1 AND rating <= 5),
      comment TEXT NULL,
      createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (bookingId) REFERENCES bookings(id) ON DELETE CASCADE,
      FOREIGN KEY (userId) REFERENCES users(id) ON DELETE CASCADE,
      FOREIGN KEY (voyageId) REFERENCES voyages(id) ON DELETE CASCADE
    ) ENGINE=InnoDB
  `);

  await db.exec(`
    CREATE TABLE IF NOT EXISTS savedBookings (
      id INT AUTO_INCREMENT PRIMARY KEY,
      userId INT NOT NULL,
      voyageId INT NOT NULL,
      savedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      UNIQUE KEY unique_saved (userId, voyageId),
      FOREIGN KEY (userId) REFERENCES users(id) ON DELETE CASCADE,
      FOREIGN KEY (voyageId) REFERENCES voyages(id) ON DELETE CASCADE
    ) ENGINE=InnoDB
  `);

  await db.exec(`
    CREATE TABLE IF NOT EXISTS payments (
      id INT AUTO_INCREMENT PRIMARY KEY,
      bookingId INT NOT NULL,
      amount DECIMAL(10,2) NOT NULL,
      paymentMethod VARCHAR(100) NOT NULL,
      transactionId VARCHAR(255) NULL UNIQUE,
      status VARCHAR(50) DEFAULT 'Completed',
      createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (bookingId) REFERENCES bookings(id) ON DELETE CASCADE
    ) ENGINE=InnoDB
  `);

  console.log('Database initialized successfully on MySQL');
};

module.exports = { db, initDatabase };
