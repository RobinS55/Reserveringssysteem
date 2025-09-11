const express = require("express");
const { createClient } = require("@supabase/supabase-js");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

// -----------------------------
// Supabase client via HTTPS
// -----------------------------
const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_ANON_KEY
);

// -----------------------------
// API routes
// -----------------------------
app.get("/api/dbtest", async (req, res) => {
  try {
    const { data, error } = await supabase
      .from("reservations")
      .select("*")
      .limit(1);
    if (error) throw error;
    res.json({ success: true, sample: data[0] || null });
  } catch (err) {
    console.error("DB test failed:", err);
    res.json({ success: false, error: err.message || JSON.stringify(err) });
  }
});

app.get("/api/testinsert", async (req, res) => {
  try {
    const { data, error } = await supabase
      .from("reservations")
      .insert([
        { object: "Renault Bus", date: new Date().toISOString().slice(0,10), start_time: "08:00", end_time: "09:00", name: "Test" }
      ])
      .select();

    if (error) throw error;
    res.json({ success: true, row: data[0] });
  } catch (err) {
    console.error("Insert failed:", err);
    res.json({ success: false, error: err.message || JSON.stringify(err) });
  }
});

// -----------------------------
// Static files
// -----------------------------
app.use(express.static(path.join(__dirname, "public")));

// Catch-all voor SPA fallback
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

// Start server
app.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
});
