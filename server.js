const express = require("express");
const app = express();
const sqlite3 = require("sqlite3").verbose();
const bodyParser = require("body-parser");
const path = require("path");

const PORT = process.env.PORT || 3000;

app.use(express.static("public"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Database
const db = new sqlite3.Database("./db.sqlite", (err) => {
  if (err) console.error(err.message);
  else console.log("Connected to SQLite database.");
});

// Tabel maken
db.run(`CREATE TABLE IF NOT EXISTS reservations (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  object TEXT,
  date TEXT,
  timeslot TEXT,
  name TEXT
)`);

// Alle reserveringen ophalen
app.get("/api/reservations", (req, res) => {
  db.all("SELECT * FROM reservations", [], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
});

// Nieuwe reservering toevoegen
app.post("/api/reservations", (req, res) => {
  const { object, date, timeslot, name } = req.body;
  db.run(
    `INSERT INTO reservations (object, date, timeslot, name) VALUES (?, ?, ?, ?)`,
    [object, date, timeslot, name],
    function(err) {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ id: this.lastID });
    }
  );
});

// Server starten
app.listen(PORT, () => {
  console.log(`Server draait op poort ${PORT}`);
});
