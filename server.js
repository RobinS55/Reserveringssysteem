const express = require("express");
const bodyParser = require("body-parser");
const { Pool } = require("pg");
const path = require("path");

const app = express();

// ✅ Render bepaalt de poort via environment variable
const PORT = process.env.PORT || 3000;

// 🔑 Database connectie via environment variables
const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
  ssl: { rejectUnauthorized: false } // nodig voor Supabase
});

app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, "public")));

// 📌 Test endpoint: check databaseconnectie
app.get("/api/dbtest", async (req, res) => {
  try {
    const result = await pool.query("SELECT NOW()");
    res.json({ success: true, server_time: result.rows[0] });
  } catch (err) {
    console.error("❌ DB connection test failed:", err);
    res.status(500).json({ success: false, error: err.message });
  }
});

// 📌 Alle reserveringen ophalen
app.get("/api/reservations", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM reservations");
    res.json(result.rows);
  } catch (err) {
    console.error("❌ DB read error:", err);
    res.status(500).json({ error: err.message });
  }
});

// 📌 Nieuwe reservering toevoegen
app.post("/api/reservations", async (req, res) => {
  const { object, date, start_time, end_time, name } = req.body;
  console.log("📥 Incoming reservation:", req.body); // laat zien wat binnenkomt

  try {
    const result = await pool.query(
      "INSERT INTO reservations (object, date, start_time, end_time, name) VALUES ($1, $2, $3, $4, $5) RETURNING *",
      [object, date, start_time, end_time, name]
    );
    console.log("✅ DB insert result:", result.rows[0]); // laat zien wat insert oplevert
    res.json(result.rows[0]);
  } catch (err) {
    console.error("❌ DB insert error:", err);
    res.status(500).json({ error: err.message });
  }
});

// 🔥 Ser
