const express = require("express");
const { Pool } = require("pg");
const bodyParser = require("body-parser");
const app = express();

const PORT = process.env.PORT || 3000;

// Frontend bestanden
app.use(express.static("public"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// PostgreSQL verbinding met Supabase
const pool = new Pool({
  user: 'postgres',                          // standaard Supabase user
  host: 'hzzbamequrdimpjhcqdj.supabase.co',  // jouw Project URL zonder https://
  database: 'postgres',                      // standaard database
  password: 'Tdv8yrSQL',                     // Database password
  port: 5432
});

// Controleer verbinding
pool.connect((err) => {
  if (err) {
    console.error('Verbinding mislukt:', err);
  } else {
    console.log('Verbonden met Supabase database!');
  }
});

// Alle reserveringen ophalen
app.get("/api/reservations", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM reservations ORDER BY date, timeslot");
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Nieuwe reservering toevoegen
app.post("/api/reservations", async (req, res) => {
  const { object, date, timeslot, name } = req.body;
  try {
    const result = await pool.query(
      "INSERT INTO reservations (object, date, timeslot, name) VALUES ($1, $2, $3, $4) RETURNING id",
      [object, date, timeslot, name]
    );
    res.json({ id: result.rows[0].id });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Server starten
app.listen(PORT, () => {
  console.log(`Server draait op poort ${PORT}`);
});
