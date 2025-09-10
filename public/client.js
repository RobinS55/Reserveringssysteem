const form = document.getElementById("reservationForm");
const agendaDiv = document.getElementById("agenda");

// Helper: maak array van 7 dagen vanaf vandaag
function getWeekDates() {
  const dates = [];
  const today = new Date();
  for (let i = 0; i < 7; i++) {
    const d = new Date(today);
    d.setDate(today.getDate() + i);
    dates.push(d.toISOString().split("T")[0]); // yyyy-mm-dd
  }
  return dates;
}

async function fetchReservations() {
  const res = await fetch("/api/reservations");
  return res.json();
}

function renderAgenda(reservations) {
  agendaDiv.innerHTML = "";
  const objects = ["Renault Bus", "Aanhanger"];
  const timeslots = ["Ochtend", "Middag"];
  const weekDates = getWeekDates();

  // Header rij
  const headerRow = document.createElement("div");
  headerRow.classList.add("agenda-row");
  headerRow.innerHTML = "<div class='cell'>Object / Dagdeel</div>" + weekDates.map(d => `<div class='cell'>${d}</div>`).join("");
  agendaDiv.appendChild(headerRow);

  objects.forEach(obj => {
    timeslots.forEach(slot => {
      const row = document.createElement("div");
      row.classList.add("agenda-row");
      const rowHeader = document.createElement("div");
      rowHeader.classList.add("cell");
      rowHeader.textContent = `${obj} - ${slot}`;
      row.appendChild(rowHeader);

      weekDates.forEach(date => {
        const cell = document.createElement("div");
        cell.classList.add("cell");
        const resv = reservations.find(r => r.object === obj && r.timeslot === slot && r.date === date);
        cell.classList.add(resv ? "booked" : "available");
        cell.textContent = resv ? resv.name : "";
        row.appendChild(cell);
      });

      agendaDiv.appendChild(row);
    });
  });
}

async function refreshAgenda() {
  const reservations = await fetchReservations();
  renderAgenda(reservations);
}

// Init
refreshAgenda();

// Form submission
form.addEventListener("submit", async (e) => {
  e.preventDefault();
  const data = {
    object: form.object.value,
    date: form.date.value,
    timeslot: form.timeslot.value,
    name: form.name.value
  };
  await fetch("/api/reservations", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data)
  });
  form.reset();
  refreshAgenda();
});
