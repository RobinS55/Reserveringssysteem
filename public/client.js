const form = document.getElementById('reservationForm');
const weekAgenda = document.getElementById('weekAgenda');

async function fetchReservations() {
  const res = await fetch('/api/reservations');
  const data = await res.json();
  displayWeekAgenda(data);
}

function displayWeekAgenda(reservations) {
  weekAgenda.innerHTML = '';
  if (reservations.length === 0) {
    weekAgenda.innerHTML = '<p>Geen reserveringen</p>';
    return;
  }

  reservations.forEach(r => {
    const div = document.createElement('div');
    div.textContent = `${r.date} | ${r.timeslot} | ${r.object} | ${r.name}`;
    weekAgenda.appendChild(div);
  });
}

form.addEventListener('submit', async (e) => {
  e.preventDefault();
  const formData = new FormData(form);
  const body = {
    object: formData.get('object'),
    date: formData.get('date'),
    timeslot: formData.get('timeslot'),
    name: formData.get('name')
  };

  await fetch('/api/reservations', {
    method: 'POST',
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify(body)
  });

  form.reset();
  fetchReservations();
});

fetchReservations();
