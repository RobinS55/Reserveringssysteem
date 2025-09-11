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

app.get("/api/reservations", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM reservations");
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Database error" });
  }
});
