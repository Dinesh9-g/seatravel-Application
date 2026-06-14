const { Pool } = require("pg");

const createPool = () => {
  if (process.env.DATABASE_URL) {
    // If a connection string is provided (e.g., Heroku), use it.
    return new Pool({
      connectionString: process.env.DATABASE_URL,
      // If your PG provider requires SSL, enable the following (uncomment):
      // ssl: { rejectUnauthorized: false },
    });
  }

  return new Pool({
    user: process.env.PGUSER || process.env.DB_USER || "postgres",
    host: process.env.PGHOST || process.env.DB_HOST || "localhost",
    database: process.env.PGDATABASE || process.env.DB_NAME || "travel-web",
    password: process.env.PGPASSWORD || process.env.DB_PASS || undefined,
    port: parseInt(process.env.PGPORT || process.env.DB_PORT, 10) || 5432,
  });
};

const pool = createPool();

async function testConnection() {
  try {
    await pool.query("SELECT 1");
    console.log("✅ Connected to Postgres database");
  } catch (err) {
    console.error("❌ Postgres connection error:", err.message || err);
    throw err;
  }
}

module.exports = {
  query: (text, params) => pool.query(text, params),
  pool,
  testConnection,
};