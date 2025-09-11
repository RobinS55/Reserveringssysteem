const express = require("express");
const bodyParser = require("body-parser");
const { Pool } = require("pg");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 3000;

// PostgreSQL connectie (via Supabase)
const pool = new Pool({
  user: "postgres",
  host: "hzzbamequrdimpjhcqdj.supabase.co", // jouw Supabase project
  database: "postgres",
  password: "Tdv8yrSQL", // 🔒 beter via Render ENV VARS
  port: 5432,
  ssl: { rejectUnauthorized: false }
});

app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, "public")));

// API routes
app.get("/api/reservations", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM reservations");
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Database error" });
  }
});

app.post("/api/reservations", async (req, res) => {
  const { object, date, start_time, end_time, name } = req.body;
  try {
    const result = await pool.query(
      "INSERT INTO reservations (object, date, start_time, end_time, name) VALUES ($1, $2, $3, $4, $5) RETURNING *",
      [object, date, start_time, end_time, name]
    );
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Database error" });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
