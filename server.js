const express = require("express");
const { Pool } = require("pg");
const bodyParser = require("body-parser");
const app = express();

const PORT = process.env.PORT || 3000;

app.use(express.static("public"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const pool = new Pool({
  user: process.env.DB_USER || 'postgres',
  host: process.env.DB_HOST || 'hzzbamequrdimpjhcqdj.supabase.co',
  database: process.env.DB_NAME || 'postgres',
  password: process.env.DB_PASSWORD || 'Tdv8yrSQL',
  port: process.env.DB_PORT || 5432
});

pool.connect((err) => {
  if (err) console.error('Verbinding mislukt:', err);
  else console.log('Verbonden met Supabase database!');
});

app.get("/api/reservations", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM reservations ORDER BY date, timeslot");
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

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

app.listen(PORT, () => {
  console.log(`Server draait op poort ${PORT}`);
});
