const express = require("express");
const { Pool } = require("pg");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 3000;

// Database connectie via environment variables
const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
  ssl: { rejectUnauthorized: false }
});

// JSON body parsing
app.use(express.json());

// -----------------------------
// API Routes (boven static files!)
// -----------------------------

// Test database connectie
app.get("/api/dbtest", async (req, res) => {
  try {
    const result = await pool.query("SELECT NOW()");
    res.json({ success: true, server_time: result.rows[0] });
  } catch (err) {
    console.error("DB connection failed:", err);
    res.status(500).json({ success: false, error: err.message });
  }
});

// Test insert
app.get("/api/testinsert", async (req, res) => {
  try {
    const result = await pool.query(
      "INSERT INTO reservations (object, date, start_time, end_time, name) VALUES ('Renault Bus', CURRENT_DATE, '08:00', '09:00', 'Test') RETURNING *"
    );
    res.json({ success: true, row: result.rows[0] });
  } catch (err) {
    console.error("Test insert failed:", err);
    res.status(500).json({ success: false, error: err.message });
  }
});

// -----------------------------
// Static files (index.html)
// -----------------------------
app.use(express.static(path.join(__dirname, "public")));

// Catch-all voor fallback
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

// Start server
app.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
});
